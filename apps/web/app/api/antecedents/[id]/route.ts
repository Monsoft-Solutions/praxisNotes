import { NextRequest } from "next/server";
import { db, withDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import { antecedents } from "@praxisnotes/database";
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
} from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { validateBody } from "@/lib/api/validation";
import { updateAntecedentSchema } from "../validation";

interface Params {
  id: string;
}

/**
 * GET handler to fetch a specific antecedent by ID
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

      // Get antecedent by ID
      const [antecedent] = await db
        .select()
        .from(antecedents)
        .where(eq(antecedents.id, id))
        .limit(1);

      if (!antecedent) {
        return createNotFoundResponse("Antecedent not found");
      }

      // Check if user has access to this antecedent
      // Users can only access global antecedents (null organizationId) or ones belonging to their organization
      if (
        antecedent.organizationId &&
        antecedent.organizationId !== organizationId
      ) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You don't have access to this antecedent",
        );
      }

      return createApiResponse(antecedent);
    } catch (error) {
      console.error("Error fetching antecedent:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch antecedent",
      );
    }
  });
}

/**
 * PATCH handler to update a specific antecedent
 * Only organization-specific antecedents can be updated, not global ones
 */
export async function PATCH(
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
        updateAntecedentSchema,
      );
      if (!bodyValidation.success) {
        return bodyValidation.response;
      }

      // Find the antecedent
      const [existingAntecedent] = await db
        .select()
        .from(antecedents)
        .where(eq(antecedents.id, id))
        .limit(1);

      if (!existingAntecedent) {
        return createNotFoundResponse("Antecedent not found");
      }

      // Check if the antecedent belongs to the user's organization
      if (!existingAntecedent.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global antecedents cannot be modified",
        );
      }

      if (existingAntecedent.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You don't have permission to update this antecedent",
        );
      }

      // Update the antecedent
      const data = bodyValidation.data;
      const [updatedAntecedent] = await db
        .update(antecedents)
        .set({
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.category !== undefined && { category: data.category }),
          updatedBy: userId,
          updatedAt: new Date(),
        })
        .where(eq(antecedents.id, id))
        .returning();

      return createApiResponse(updatedAntecedent);
    } catch (error) {
      console.error("Error updating antecedent:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update antecedent",
      );
    }
  });
}

/**
 * DELETE handler to remove a specific antecedent
 * Only organization-specific antecedents can be deleted, not global ones
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

      // Find the antecedent
      const [existingAntecedent] = await db
        .select()
        .from(antecedents)
        .where(eq(antecedents.id, id))
        .limit(1);

      if (!existingAntecedent) {
        return createNotFoundResponse("Antecedent not found");
      }

      // Check if the antecedent belongs to the user's organization
      if (!existingAntecedent.organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "Global antecedents cannot be deleted",
        );
      }

      if (existingAntecedent.organizationId !== organizationId) {
        return createErrorResponse(
          ErrorCode.FORBIDDEN,
          "You don't have permission to delete this antecedent",
        );
      }

      // Delete the antecedent
      await db.delete(antecedents).where(eq(antecedents.id, id));

      return createApiResponse({
        success: true,
        message: "Antecedent deleted",
      });
    } catch (error) {
      console.error("Error deleting antecedent:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to delete antecedent",
      );
    }
  });
}
