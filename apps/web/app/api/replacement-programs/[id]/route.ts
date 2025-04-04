import { NextRequest } from "next/server";
import { db, withDb } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { replacementPrograms } from "@praxisnotes/database";
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
} from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { validateBody } from "@/lib/api/validation";
import { updateReplacementProgramSchema } from "../validation";

interface Params {
  id: string;
}

/**
 * GET handler to fetch a specific replacement program by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;

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

      // Get replacement program by ID
      const [replacementProgram] = await db
        .select()
        .from(replacementPrograms)
        .where(eq(replacementPrograms.id, id))
        .limit(1);

      if (!replacementProgram) {
        return createNotFoundResponse("Replacement program not found");
      }

      // Check if user has access to this replacement program
      // Users can only access global replacement programs (null organizationId) or ones belonging to their organization
      if (
        replacementProgram.organizationId &&
        replacementProgram.organizationId !== organizationId
      ) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You don't have access to this replacement program",
        );
      }

      return createApiResponse(replacementProgram);
    } catch (error) {
      console.error("Error fetching replacement program:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch replacement program",
      );
    }
  });
}

/**
 * PUT handler to update a specific replacement program by ID
 * Users can only update replacement programs that belong to their organization
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;

  return withDb(async () => {
    try {
      // Require authenticated user with organization
      const session = await requireAuthWithOrg();
      const { id: userId, organizationId } = session.user;

      if (!organizationId) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "User must belong to an organization",
        );
      }

      // Validate request body
      const bodyValidation = await validateBody(
        request,
        updateReplacementProgramSchema,
      );
      if (!bodyValidation.success) {
        return bodyValidation.response;
      }

      // Check if replacement program exists and belongs to the user's organization
      const [existingReplacementProgram] = await db
        .select()
        .from(replacementPrograms)
        .where(eq(replacementPrograms.id, id))
        .limit(1);

      if (!existingReplacementProgram) {
        return createNotFoundResponse("Replacement program not found");
      }

      // Users cannot edit global replacement programs (organizationId is null)
      // Users can only edit replacement programs that belong to their organization
      if (!existingReplacementProgram.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global replacement programs cannot be modified",
        );
      }

      if (existingReplacementProgram.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You can only edit replacement programs that belong to your organization",
        );
      }

      // Update the replacement program
      const data = bodyValidation.data;
      const [updatedReplacementProgram] = await db
        .update(replacementPrograms)
        .set({
          name: data.name,
          description: data.description,
          category: data.category,
          steps: data.steps || existingReplacementProgram.steps,
          updatedBy: userId,
          // Note: We don't update organizationId since we don't want to change ownership
        })
        .where(
          and(
            eq(replacementPrograms.id, id),
            eq(replacementPrograms.organizationId, organizationId),
          ),
        )
        .returning();

      return createApiResponse(updatedReplacementProgram);
    } catch (error) {
      console.error("Error updating replacement program:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update replacement program",
      );
    }
  });
}

/**
 * DELETE handler to delete a specific replacement program by ID
 * Users can only delete replacement programs that belong to their organization
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;

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

      // Check if replacement program exists and belongs to the user's organization
      const [existingReplacementProgram] = await db
        .select()
        .from(replacementPrograms)
        .where(eq(replacementPrograms.id, id))
        .limit(1);

      if (!existingReplacementProgram) {
        return createNotFoundResponse("Replacement program not found");
      }

      // Users cannot delete global replacement programs (organizationId is null)
      // Users can only delete replacement programs that belong to their organization
      if (!existingReplacementProgram.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global replacement programs cannot be deleted",
        );
      }

      if (existingReplacementProgram.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You can only delete replacement programs that belong to your organization",
        );
      }

      // Delete the replacement program
      await db
        .delete(replacementPrograms)
        .where(
          and(
            eq(replacementPrograms.id, id),
            eq(replacementPrograms.organizationId, organizationId),
          ),
        );

      return createApiResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting replacement program:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to delete replacement program",
      );
    }
  });
}
