import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "@/lib/db";
import { sessions, sessionABCs } from "@praxisnotes/database";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode, ABCEntry } from "@praxisnotes/types";
import { eq } from "drizzle-orm";

/**
 * GET handler for a specific session with its ABCs data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string; sessionId: string } },
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

      const { clientId, sessionId } = await params;

      if (!clientId || !sessionId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Client ID and Session ID are required",
        );
      }

      // Get session with its ABCs data
      const sessionData = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
        with: {
          abcs: true,
          notes: true,
          client: true,
        },
      });

      if (!sessionData) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Session not found");
      }

      // Check if the session belongs to the requested client
      if (sessionData.clientId !== clientId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Session does not belong to the specified client",
        );
      }

      return createApiResponse(sessionData);
    } catch (error) {
      console.error("Error fetching session:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch session",
      );
    }
  });
}

/**
 * PUT handler for updating a specific session
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { clientId: string; sessionId: string } },
) {
  return withDb(async () => {
    try {
      // Require authenticated user with organization
      const userSession = await requireAuthWithOrg();
      const { organizationId, id: userId } = userSession.user;

      if (!organizationId) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "User must belong to an organization",
        );
      }

      const { clientId, sessionId } = await params;

      if (!clientId || !sessionId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Client ID and Session ID are required",
        );
      }

      // Parse request body
      const body = await request.json();

      // Verify the session exists and belongs to the client
      const existingSession = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });

      if (!existingSession) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Session not found");
      }

      if (existingSession.clientId !== clientId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Session does not belong to the specified client",
        );
      }

      // Update session in database
      const [updatedSession] = await db
        .update(sessions)
        .set({
          sessionDate: new Date(body.sessionDate),
          startTime: body.startTime,
          endTime: body.endTime,
          location: body.location,
          status: body.status,
          formData: body,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, sessionId))
        .returning();

      // Update ABCs - first delete existing entries
      await db.delete(sessionABCs).where(eq(sessionABCs.sessionId, sessionId));

      // Then insert new ABC entries
      if (body.abcEntries && body.abcEntries.length > 0) {
        await Promise.all(
          body.abcEntries.map(async (entry: ABCEntry, index: number) => {
            await db.insert(sessionABCs).values({
              sessionId: sessionId,
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

      return createApiResponse(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update session",
      );
    }
  });
}

/**
 * DELETE handler for deleting a specific session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { clientId: string; sessionId: string } },
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

      const { clientId, sessionId } = await params;

      if (!clientId || !sessionId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Client ID and Session ID are required",
        );
      }

      // Verify the session exists and belongs to the client
      const existingSession = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });

      if (!existingSession) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Session not found");
      }

      if (existingSession.clientId !== clientId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Session does not belong to the specified client",
        );
      }

      // Delete session (ABCs will be cascade deleted due to foreign key constraint)
      await db.delete(sessions).where(eq(sessions.id, sessionId));

      return createApiResponse({ success: true });
    } catch (error) {
      console.error("Error deleting session:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to delete session",
      );
    }
  });
}
