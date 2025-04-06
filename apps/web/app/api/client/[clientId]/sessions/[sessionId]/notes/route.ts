import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "@/lib/db";
import { sessions, sessionNotes } from "@praxisnotes/database";
import { NotesGenerationRequest, SessionFormData } from "@praxisnotes/types";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { eq } from "drizzle-orm";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createSessionNotesPrompt } from "@/lib/ai";

/**
 * POST handler for generating notes
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string; sessionId: string } },
) {
  return withDb(async () => {
    try {
      // Require authenticated user with organization
      const authSession = await requireAuthWithOrg();
      const { organizationId } = authSession.user;

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
          "Client ID and session ID are required",
        );
      }

      // Get session data
      const [sessionData] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId))
        .limit(1);

      if (!sessionData) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Session not found");
      }

      // Check if notes already exist
      //   const existingNotes = await db
      //     .select()
      //     .from(sessionNotes)
      //     .where(eq(sessionNotes.sessionId, sessionId))
      //     .limit(1);

      //   if (existingNotes.length > 0) {
      //     // Return existing notes if they exist
      //     return createApiResponse(existingNotes[0]);
      //   }

      // Generate notes using AI
      const formData = sessionData.formData as SessionFormData;
      const generatedNotes = await generateSessionNotes(formData);

      // Save generated notes
      const [notes] = await db
        .insert(sessionNotes)
        .values({
          sessionId,
          content: generatedNotes.content,
          generationMetadata: generatedNotes.metadata,
          isGenerated: true,
        })
        .returning();

      return createApiResponse(notes);
    } catch (error) {
      console.error("Error generating notes:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to generate notes",
      );
    }
  });
}

/**
 * GET handler for retrieving notes
 */
export async function GET(
  _request: NextRequest,
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

      const { sessionId } = await params;

      if (!sessionId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Session ID is required",
        );
      }

      // Get notes
      const [notes] = await db
        .select()
        .from(sessionNotes)
        .where(eq(sessionNotes.sessionId, sessionId))
        .limit(1);

      if (!notes) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Notes not found");
      }

      return createApiResponse(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch notes",
      );
    }
  });
}

/**
 * PUT handler for updating notes
 */
export async function PUT(
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

      const { sessionId } = await params;

      if (!sessionId) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Session ID is required",
        );
      }

      // Parse request body
      const body = await request.json();

      if (!body.content) {
        return createErrorResponse(
          ErrorCode.BAD_REQUEST,
          "Content is required",
        );
      }

      // Update notes
      const [updatedNotes] = await db
        .update(sessionNotes)
        .set({
          content: body.content,
          updatedAt: new Date(),
        })
        .where(eq(sessionNotes.sessionId, sessionId))
        .returning();

      if (!updatedNotes) {
        return createErrorResponse(ErrorCode.NOT_FOUND, "Notes not found");
      }

      return createApiResponse(updatedNotes);
    } catch (error) {
      console.error("Error updating notes:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update notes",
      );
    }
  });
}

// Helper function to generate notes using Anthropic
async function generateSessionNotes(sessionData: SessionFormData) {
  // Use the prompt from our dedicated module
  const prompt = createSessionNotesPrompt(sessionData);

  try {
    const { text, reasoning } = await generateText({
      model: anthropic("claude-3-7-sonnet-latest"),
      // model: openai("gpt-4.5-preview"),
      prompt,
    });

    return {
      content: text,
      metadata: {
        modelName: "claude-3-5-sonnet",
        promptTokens: 0, // We don't have access to token counts directly
        completionTokens: 0,
        totalTokens: 0,
        reasoning,
      },
    };
  } catch (error) {
    console.error("Error generating notes:", error);
    throw error;
  }
}
