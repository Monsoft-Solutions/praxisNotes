import { z } from "zod";
import { paginationSchema } from "@/lib/validations/common";

/**
 * Sort field options for replacement programs
 */
const replacementProgramSortFields = ["name", "category", "createdAt"] as const;

/**
 * Sort order options
 */
const sortOrders = ["asc", "desc"] as const;

/**
 * GET request validation schema for replacement programs API
 * Validates query parameters for replacement programs retrieval
 */
export const getReplacementProgramsQuerySchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(replacementProgramSortFields).optional().default("name"),
    order: z.enum(sortOrders).optional().default("asc"),
  })
  .merge(
    paginationSchema.extend({
      // Override the default limit for replacement programs
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 50))
        .pipe(
          z
            .number()
            .int()
            .positive()
            .max(100)
            .default(50)
            .describe("Number of items per page (max 100)"),
        ),
    }),
  );

/**
 * Type for GET replacement programs query parameters
 */
export type GetReplacementProgramsQueryParams = z.infer<
  typeof getReplacementProgramsQuerySchema
>;

/**
 * Validation schema for creating a new replacement program
 */
export const createReplacementProgramSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  steps: z.record(z.string()).optional(),
});

/**
 * Type for creating a replacement program
 */
export type CreateReplacementProgramRequest = z.infer<
  typeof createReplacementProgramSchema
>;

/**
 * Validation schema for updating an existing replacement program
 */
export const updateReplacementProgramSchema = createReplacementProgramSchema;

/**
 * Type for updating a replacement program
 */
export type UpdateReplacementProgramRequest = z.infer<
  typeof updateReplacementProgramSchema
>;
