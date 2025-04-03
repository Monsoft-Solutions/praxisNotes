import { NextRequest } from "next/server";
import { db, withDb } from "../../../lib/db";
import { eq, isNull, or, ilike, desc, asc, count } from "drizzle-orm";
import { behaviors } from "@praxisnotes/database";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { validateQuery, validateBody } from "@/lib/api/validation";
import { getBehaviorsQuerySchema, createBehaviorSchema } from "./validation";

/**
 * GET handler for behaviors API
 * Returns behaviors that are either global (organizationId is NULL)
 * or belong to the user's organization
 *
 * Query parameters:
 * - page: Page number (starts at 1)
 * - limit: Number of items per page (default 50)
 * - sort: Field to sort by (default 'name')
 * - order: Sort order ('asc' or 'desc', default 'asc')
 * - search: Search term to filter by name
 * - category: Filter by category
 */
export async function GET(request: NextRequest) {
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

      // Validate query parameters
      const queryValidation = await validateQuery(
        request,
        getBehaviorsQuerySchema,
      );
      if (!queryValidation.success) {
        return queryValidation.response;
      }

      const { page, limit, sort, order, search, category } =
        queryValidation.data;
      const offset = (page - 1) * limit;

      // Build the base query
      let query = db
        .select()
        .from(behaviors)
        .where(
          or(
            isNull(behaviors.organizationId),
            eq(behaviors.organizationId, organizationId),
          ),
        );

      // Apply additional filters if provided
      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        query = query.where(ilike(behaviors.name, searchTerm));
      }

      if (category) {
        query = query.where(eq(behaviors.category, category));
      }

      // Apply sorting
      if (sort === "name") {
        query =
          order === "desc"
            ? query.orderBy(desc(behaviors.name))
            : query.orderBy(asc(behaviors.name));
      } else if (sort === "category") {
        query =
          order === "desc"
            ? query.orderBy(desc(behaviors.category))
            : query.orderBy(asc(behaviors.category));
      } else if (sort === "createdAt") {
        query =
          order === "desc"
            ? query.orderBy(desc(behaviors.createdAt))
            : query.orderBy(asc(behaviors.createdAt));
      }

      // Execute the final query with pagination
      const userBehaviors = await query.limit(limit).offset(offset);

      // Get total count for pagination
      const countQuery = await db
        .select({ count: count() })
        .from(behaviors)
        .where(
          or(
            isNull(behaviors.organizationId),
            eq(behaviors.organizationId, organizationId),
          ),
        );

      const total = Number(countQuery[0].count);
      const totalPages = Math.ceil(total / limit);

      return createApiResponse(userBehaviors, {
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching behaviors:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch behaviors",
      );
    }
  });
}

/**
 * POST handler for creating a new behavior
 * Creates a behavior that belongs to the user's organization
 */
export async function POST(request: NextRequest) {
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
      const bodyValidation = await validateBody(request, createBehaviorSchema);
      if (!bodyValidation.success) {
        return bodyValidation.response;
      }

      const data = bodyValidation.data;

      // Create new behavior
      const [newBehavior] = await db
        .insert(behaviors)
        .values({
          name: data.name,
          description: data.description,
          category: data.category,
          organizationId: organizationId,
          createdBy: userId,
          updatedBy: userId,
        })
        .returning();

      return createApiResponse(newBehavior, {
        status: 201,
      });
    } catch (error) {
      console.error("Error creating behavior:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to create behavior",
      );
    }
  });
}
