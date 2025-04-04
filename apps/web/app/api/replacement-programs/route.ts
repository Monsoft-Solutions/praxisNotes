import { NextRequest } from "next/server";
import { db, withDb } from "../../../lib/db";
import { eq, isNull, or, ilike, desc, asc, count } from "drizzle-orm";
import { replacementPrograms } from "@praxisnotes/database";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";
import { validateQuery, validateBody } from "@/lib/api/validation";
import {
  getReplacementProgramsQuerySchema,
  createReplacementProgramSchema,
} from "./validation";

/**
 * GET handler for replacement programs API
 * Returns replacement programs that are either global (organizationId is NULL)
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
        getReplacementProgramsQuerySchema,
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
        .from(replacementPrograms)
        .where(
          or(
            isNull(replacementPrograms.organizationId),
            eq(replacementPrograms.organizationId, organizationId),
          ),
        );

      // Apply additional filters if provided
      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        query = query.where(ilike(replacementPrograms.name, searchTerm));
      }

      if (category) {
        query = query.where(eq(replacementPrograms.category, category));
      }

      // Apply sorting
      if (sort === "name") {
        query =
          order === "desc"
            ? query.orderBy(desc(replacementPrograms.name))
            : query.orderBy(asc(replacementPrograms.name));
      } else if (sort === "category") {
        query =
          order === "desc"
            ? query.orderBy(desc(replacementPrograms.category))
            : query.orderBy(asc(replacementPrograms.category));
      } else if (sort === "createdAt") {
        query =
          order === "desc"
            ? query.orderBy(desc(replacementPrograms.createdAt))
            : query.orderBy(asc(replacementPrograms.createdAt));
      }

      // Execute the final query with pagination
      const userReplacementPrograms = await query.limit(limit).offset(offset);

      // Get total count for pagination
      const countQuery = await db
        .select({ count: count() })
        .from(replacementPrograms)
        .where(
          or(
            isNull(replacementPrograms.organizationId),
            eq(replacementPrograms.organizationId, organizationId),
          ),
        );

      const total = Number(countQuery[0].count);
      const totalPages = Math.ceil(total / limit);

      return createApiResponse(userReplacementPrograms, {
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching replacement programs:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch replacement programs",
      );
    }
  });
}

/**
 * POST handler for creating a new replacement program
 * Creates a replacement program that belongs to the user's organization
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
      const bodyValidation = await validateBody(
        request,
        createReplacementProgramSchema,
      );
      if (!bodyValidation.success) {
        return bodyValidation.response;
      }

      const data = bodyValidation.data;

      // Create new replacement program
      const [newReplacementProgram] = await db
        .insert(replacementPrograms)
        .values({
          name: data.name,
          description: data.description,
          category: data.category,
          steps: data.steps || {},
          organizationId: organizationId,
          createdBy: userId,
          updatedBy: userId,
        })
        .returning();

      return createApiResponse(newReplacementProgram, {
        status: 201,
      });
    } catch (error) {
      console.error("Error creating replacement program:", error);
      return createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to create replacement program",
      );
    }
  });
}
