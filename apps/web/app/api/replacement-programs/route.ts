import { NextRequest } from "next/server";
import { db, withDb } from "../../../lib/db";
import { eq, isNull, or, ilike, desc, asc, sql, count } from "drizzle-orm";
import { replacementPrograms, behaviors } from "@praxisnotes/database";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { requireAuthWithOrg } from "@/lib/auth/auth";
import { ErrorCode } from "@praxisnotes/types";

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
 * - targetBehaviorId: Filter by target behavior
 */
export async function GET(request: NextRequest) {
  return await withDb(async () => {
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

      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
      const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
      const offset = (page - 1) * limit;
      const sortField = searchParams.get("sort") || "name";
      const sortOrder = searchParams.get("order") || "asc";
      const search = searchParams.get("search");
      const category = searchParams.get("category");
      const targetBehaviorId = searchParams.get("targetBehaviorId");

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

      if (targetBehaviorId) {
        query = query.where(
          eq(replacementPrograms.targetBehaviorId, targetBehaviorId),
        );
      }

      // Apply sorting
      if (sortField === "name") {
        query =
          sortOrder === "desc"
            ? query.orderBy(desc(replacementPrograms.name))
            : query.orderBy(asc(replacementPrograms.name));
      } else if (sortField === "category") {
        query =
          sortOrder === "desc"
            ? query.orderBy(desc(replacementPrograms.category))
            : query.orderBy(asc(replacementPrograms.category));
      } else if (sortField === "createdAt") {
        query =
          sortOrder === "desc"
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
        meta: {
          page,
          perPage: limit,
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
