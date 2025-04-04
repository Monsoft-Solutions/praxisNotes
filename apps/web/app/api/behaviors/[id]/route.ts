import { NextRequest } from "next/server";
import { db, withDb } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { behaviors } from "@praxisnotes/database";
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
} from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { validateBody } from "@/lib/api/validation";
import { updateBehaviorSchema } from "../validation";

interface Params {
  id: string;
}

/**
 * GET handler to fetch a specific behavior by ID
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

      // Get behavior by ID
      const [behavior] = await db
        .select()
        .from(behaviors)
        .where(eq(behaviors.id, id))
        .limit(1);

      if (!behavior) {
        return createNotFoundResponse("Behavior not found");
      }

      // Check if user has access to this behavior
      // Users can only access global behaviors (null organizationId) or ones belonging to their organization
      if (
        behavior.organizationId &&
        behavior.organizationId !== organizationId
      ) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You don't have access to this behavior",
        );
      }

      return createApiResponse(behavior);
    } catch (error) {
      console.error("Error fetching behavior:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch behavior",
      );
    }
  });
}

/**
 * PUT handler to update a specific behavior by ID
 * Users can only update behaviors that belong to their organization
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
      const bodyValidation = await validateBody(request, updateBehaviorSchema);
      if (!bodyValidation.success) {
        return bodyValidation.response;
      }

      // Check if behavior exists and belongs to the user's organization
      const [existingBehavior] = await db
        .select()
        .from(behaviors)
        .where(eq(behaviors.id, id))
        .limit(1);

      if (!existingBehavior) {
        return createNotFoundResponse("Behavior not found");
      }

      // Users cannot edit global behaviors (organizationId is null)
      // Users can only edit behaviors that belong to their organization
      if (!existingBehavior.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global behaviors cannot be modified",
        );
      }

      if (existingBehavior.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You can only edit behaviors that belong to your organization",
        );
      }

      // Update the behavior
      const data = bodyValidation.data;
      const [updatedBehavior] = await db
        .update(behaviors)
        .set({
          name: data.name,
          description: data.description,
          category: data.category,
          updatedBy: userId,
          // Note: We don't update organizationId since we don't want to change ownership
        })
        .where(
          and(
            eq(behaviors.id, id),
            eq(behaviors.organizationId, organizationId),
          ),
        )
        .returning();

      return createApiResponse(updatedBehavior);
    } catch (error) {
      console.error("Error updating behavior:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update behavior",
      );
    }
  });
}
