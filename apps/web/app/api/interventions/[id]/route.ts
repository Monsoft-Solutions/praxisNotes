import { NextRequest } from "next/server";
import { db, withDb } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { interventions } from "@praxisnotes/database";
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
} from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { validateBody } from "@/lib/api/validation";
import { updateInterventionSchema } from "../validation";

interface Params {
  id: string;
}

/**
 * GET handler to fetch a specific intervention by ID
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

      // Get intervention by ID
      const [intervention] = await db
        .select()
        .from(interventions)
        .where(eq(interventions.id, id))
        .limit(1);

      if (!intervention) {
        return createNotFoundResponse("Intervention not found");
      }

      // Check if user has access to this intervention
      // Users can only access global interventions (null organizationId) or ones belonging to their organization
      if (
        intervention.organizationId &&
        intervention.organizationId !== organizationId
      ) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You don't have access to this intervention",
        );
      }

      return createApiResponse(intervention);
    } catch (error) {
      console.error("Error fetching intervention:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch intervention",
      );
    }
  });
}

/**
 * PUT handler to update a specific intervention by ID
 * Users can only update interventions that belong to their organization
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
        updateInterventionSchema,
      );
      if (!bodyValidation.success) {
        return bodyValidation.response;
      }

      // Check if intervention exists and belongs to the user's organization
      const [existingIntervention] = await db
        .select()
        .from(interventions)
        .where(eq(interventions.id, id))
        .limit(1);

      if (!existingIntervention) {
        return createNotFoundResponse("Intervention not found");
      }

      // Users cannot edit global interventions (organizationId is null)
      // Users can only edit interventions that belong to their organization
      if (!existingIntervention.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global interventions cannot be modified",
        );
      }

      if (existingIntervention.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You can only edit interventions that belong to your organization",
        );
      }

      // Update the intervention
      const data = bodyValidation.data;
      const [updatedIntervention] = await db
        .update(interventions)
        .set({
          name: data.name,
          description: data.description,
          category: data.category,
          updatedBy: userId,
          // Note: We don't update organizationId since we don't want to change ownership
        })
        .where(
          and(
            eq(interventions.id, id),
            eq(interventions.organizationId, organizationId),
          ),
        )
        .returning();

      return createApiResponse(updatedIntervention);
    } catch (error) {
      console.error("Error updating intervention:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update intervention",
      );
    }
  });
}

/**
 * DELETE handler to delete a specific intervention by ID
 * Users can only delete interventions that belong to their organization
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

      // Check if intervention exists and belongs to the user's organization
      const [existingIntervention] = await db
        .select()
        .from(interventions)
        .where(eq(interventions.id, id))
        .limit(1);

      if (!existingIntervention) {
        return createNotFoundResponse("Intervention not found");
      }

      // Users cannot delete global interventions (organizationId is null)
      // Users can only delete interventions that belong to their organization
      if (!existingIntervention.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global interventions cannot be deleted",
        );
      }

      if (existingIntervention.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You can only delete interventions that belong to your organization",
        );
      }

      // Delete the intervention
      await db
        .delete(interventions)
        .where(
          and(
            eq(interventions.id, id),
            eq(interventions.organizationId, organizationId),
          ),
        );

      return createApiResponse({
        success: true,
        message: "Intervention deleted",
      });
    } catch (error) {
      console.error("Error deleting intervention:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to delete intervention",
      );
    }
  });
}
