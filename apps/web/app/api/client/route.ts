import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "../../../lib/db";
import { count, eq, ilike, or } from "drizzle-orm";
import { ErrorCode } from "@praxisnotes/types";

// Direct import from client table
import { Client, clients } from "@praxisnotes/database";
import { createErrorResponse, createApiResponse } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { validateQuery } from "@/lib/api/validation";
import { getClientQuerySchema } from "./validation";

/**
 * GET handler for clients API
 * Supports querying clients by id, search term, or returning all clients
 * Supports pagination with page and limit parameters
 */
export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return createErrorResponse(ErrorCode.UNAUTHORIZED, "Unauthorized");
  }

  // Validate query parameters
  const queryValidation = await validateQuery(request, getClientQuerySchema);
  if (!queryValidation.success) {
    return queryValidation.response;
  }

  const { id, search, page, limit } = queryValidation.data;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  return await withDb(async () => {
    if (id) {
      // If id is provided, return specific client
      const clientDb = await db
        .select()
        .from(clients)
        .where(eq(clients.id, id))
        .limit(1);

      if (!clientDb.length) {
        // Create a custom error response directly for more control
        return createErrorResponse(ErrorCode.NOT_FOUND, "Client not found");
      }

      const client: Client = {
        ...clientDb[0],
        createdAt: clientDb[0].createdAt.toISOString(),
        updatedAt: clientDb[0].updatedAt.toISOString(),
      };

      return createApiResponse<Client>(client);
    } else if (search) {
      // Use case-insensitive search with ilike for better pattern matching
      const searchPattern = `%${search.trim().toLowerCase()}%`;

      // Get total count for pagination
      const countResult = await db
        .select({ count: count() })
        .from(clients)
        .where(
          or(
            ilike(clients.firstName, searchPattern),
            ilike(clients.lastName, searchPattern),
          ),
        );

      const total = Number(countResult[0].count);
      const totalPages = Math.ceil(total / limit);

      // Get paginated results
      const filteredClients = await db
        .select()
        .from(clients)
        .where(
          or(
            ilike(clients.firstName, searchPattern),
            ilike(clients.lastName, searchPattern),
          ),
        )
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        data: filteredClients,
        pagination: {
          total,
          totalPages,
          page,
          limit,
        },
      });
    } else {
      // Get total count for pagination
      const countResult = await db.select({ count: count() }).from(clients);

      const total = Number(countResult[0].count);
      const totalPages = Math.ceil(total / limit);

      // If no parameters, return paginated clients
      const allClients = await db
        .select()
        .from(clients)
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        data: allClients,
        pagination: {
          total,
          totalPages,
          page,
          limit,
        },
      });
    }
  });
}
