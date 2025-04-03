import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "../../../lib/db";
import { count, eq, ilike, or } from "drizzle-orm";
import { ApiError, ErrorCode } from "@praxisnotes/types";

// Direct import from client table
import { Client, clients } from "@praxisnotes/database";
import { createErrorResponse, createApiResponse } from "@/lib/api";

/**
 * GET handler for clients API
 * Supports querying clients by id, search term, or returning all clients
 * Supports pagination with page and limit parameters
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search");

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Validate pagination parameters
  const validatedPage = isNaN(page) || page < 1 ? 1 : page;
  const validatedLimit = isNaN(limit) || limit < 1 || limit > 100 ? 10 : limit;

  // Calculate offset for pagination
  const offset = (validatedPage - 1) * validatedLimit;

  return await withDb(async () => {
    if (id) {
      // Validate UUID format
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(id)) {
        const error: ApiError = {
          code: ErrorCode.BAD_REQUEST,
          message: "Invalid client ID format",
        };
        return NextResponse.json({ error }, { status: 400 });
      }

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
      // Validate and sanitize search input
      if (search.trim().length === 0) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Search term cannot be empty",
        );
      }

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
            ilike(clients.email || "", searchPattern),
          ),
        );

      const total = Number(countResult[0].count);
      const totalPages = Math.ceil(total / validatedLimit);

      // Get paginated results
      const filteredClients = await db
        .select()
        .from(clients)
        .where(
          or(
            ilike(clients.firstName, searchPattern),
            ilike(clients.lastName, searchPattern),
            ilike(clients.email || "", searchPattern),
          ),
        )
        .limit(validatedLimit)
        .offset(offset);

      return NextResponse.json({
        data: filteredClients,
        pagination: {
          total,
          totalPages,
          page: validatedPage,
          limit: validatedLimit,
        },
      });
    } else {
      // Get total count for pagination
      const countResult = await db.select({ count: count() }).from(clients);

      const total = Number(countResult[0].count);
      const totalPages = Math.ceil(total / validatedLimit);

      // If no parameters, return paginated clients
      const allClients = await db
        .select()
        .from(clients)
        .limit(validatedLimit)
        .offset(offset);

      return NextResponse.json({
        data: allClients,
        pagination: {
          total,
          totalPages,
          page: validatedPage,
          limit: validatedLimit,
        },
      });
    }
  });
}
