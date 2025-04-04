import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "../../../lib/db";
import { count, eq, ilike, or } from "drizzle-orm";
import { ErrorCode } from "@praxisnotes/types";

// Direct import from client table
import {
  Client,
  clients,
  clientBehaviors,
  clientReplacementPrograms,
  clientInterventions,
  clientReplacementProgramBehaviors,
  clientInterventionBehaviors,
  insertClientSchema,
} from "@praxisnotes/database";
import { createErrorResponse, createApiResponse } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { validateQuery } from "@/lib/api/validation";
import { getClientQuerySchema, createClientBodySchema } from "./validation";
import { z } from "zod";

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

/**
 * POST handler for creating a new client with related entities
 */
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return createErrorResponse(ErrorCode.UNAUTHORIZED, "Unauthorized");
  }

  if (!session.user.organizationId) {
    return createErrorResponse(
      ErrorCode.UNAUTHORIZED,
      "User must belong to an organization",
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();

    const validationResult = createClientBodySchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        ErrorCode.BAD_REQUEST,
        "Invalid client data",
        validationResult.error.format(),
      );
    }

    const { client, behaviors, replacementPrograms, interventions } =
      validationResult.data;

    return await withDb(async () => {
      // Create the client
      const [newClient] = await db
        .insert(clients)
        .values({
          firstName: client.firstName,
          lastName: client.lastName,
          notes: client.notes,
          organizationId: session.user.organizationId!,
        })
        .returning();

      // Array to store created behavior IDs
      const createdBehaviorIds: string[] = [];

      // Create behaviors if provided
      if (behaviors && behaviors.length > 0) {
        for (const behavior of behaviors) {
          const [newBehavior] = await db
            .insert(clientBehaviors)
            .values({
              clientId: newClient.id,
              behaviorName: behavior.behaviorName,
              behaviorDescription: behavior.behaviorDescription || null,
              baseline: behavior.baseline,
              type: behavior.type,
              topographies: behavior.topographies,
            })
            .returning();

          createdBehaviorIds.push(newBehavior.id);
        }
      }

      // Create replacement programs if provided
      if (replacementPrograms && replacementPrograms.length > 0) {
        for (const program of replacementPrograms) {
          const [newProgram] = await db
            .insert(clientReplacementPrograms)
            .values({
              clientId: newClient.id,
              programName: program.programName,
              programDescription: program.programDescription || null,
              baseline: program.baseline,
            })
            .returning();

          // Create behavior associations
          for (const behaviorIndex of program.behaviorIndices) {
            if (
              behaviorIndex >= 0 &&
              behaviorIndex < createdBehaviorIds.length
            ) {
              await db.insert(clientReplacementProgramBehaviors).values({
                clientReplacementProgramId: newProgram.id,
                clientBehaviorId: createdBehaviorIds[behaviorIndex],
              });
            }
          }
        }
      }

      // Create interventions if provided
      if (interventions && interventions.length > 0) {
        for (const intervention of interventions) {
          const [newIntervention] = await db
            .insert(clientInterventions)
            .values({
              clientId: newClient.id,
              interventionName: intervention.interventionName,
              interventionDescription:
                intervention.interventionDescription || null,
            })
            .returning();

          // Create behavior associations
          for (const behaviorIndex of intervention.behaviorIndices) {
            if (
              behaviorIndex >= 0 &&
              behaviorIndex < createdBehaviorIds.length
            ) {
              await db.insert(clientInterventionBehaviors).values({
                clientInterventionId: newIntervention.id,
                clientBehaviorId: createdBehaviorIds[behaviorIndex],
              });
            }
          }
        }
      }

      return createApiResponse<Client>(newClient);
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return createErrorResponse(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to create client",
    );
  }
}
