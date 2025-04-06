import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "@/lib/db";
import {
  insertSessionSchema,
  sessions,
  sessionABCs,
} from "@praxisnotes/database";
import { SessionFormValues, ABCEntry } from "@praxisnotes/types";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { eq, desc } from "drizzle-orm";

/**
 * POST handler for creating a new session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } },
) {
  return withDb(async () => {
    try {
      // Require authenticated user with organization
      const session = await requireAuthWithOrg();
      const { organizationId, id: userId } = session.user;

      if (!organizationId) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "User must belong to an organization",
        );
      }

      const requestParams = await params;

      const { clientId } = await params;

      if (!clientId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Client ID is required",
        );
      }

      // Parse request body
      const body: SessionFormValues & { status: string } = await request.json();

      const validatedSession = insertSessionSchema.safeParse(body);

      // Insert session into database
      const [newSession] = await db
        .insert(sessions)
        .values({
          clientId,
          userId,
          sessionDate: new Date(body.sessionDate),
          startTime: body.startTime,
          endTime: body.endTime,
          location: body.location,
          status: body.status as any, // Cast to any to bypass type checking
          formData: body, // Store the entire form data as JSON
          createdBy: userId,
          updatedBy: userId,
        })
        .returning();

      // Now insert the ABC entries
      if (body.abcEntries && body.abcEntries.length > 0) {
        // Create ABC entries in the database
        await Promise.all(
          body.abcEntries.map(async (entry: ABCEntry, index: number) => {
            await db.insert(sessionABCs).values({
              sessionId: newSession.id,
              antecedent: entry.activityAntecedent,
              behavior: entry.behaviors.join(", "),
              consequence: [
                ...entry.interventions,
                ...entry.replacementPrograms,
              ].join(", "),
              contextNotes: "",
              sequenceOrder: (index + 1).toString(),
            });
          }),
        );
      }

      return createApiResponse(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to create session",
      );
    }
  });
}

/**
 * GET handler for listing client sessions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } },
) {
  return withDb(async () => {
    try {
      // Require authenticated user with organization
      const session = await requireAuthWithOrg();
      const { organizationId } = session.user;

      if (!organizationId) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "User must belong to an organization",
        );
      }

      const { clientId } = params;

      if (!clientId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Client ID is required",
        );
      }

      // Get sessions for client
      const clientSessions = await db.query.sessions.findMany({
        where: eq(sessions.clientId, clientId),
        with: {
          abcs: true,
        },
        orderBy: [desc(sessions.sessionDate)],
      });

      return createApiResponse(clientSessions);
    } catch (error) {
      console.error("Error fetching client sessions:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch client sessions",
      );
    }
  });
}

function convertTimeToDate(time: string): string {
  return time;
}
