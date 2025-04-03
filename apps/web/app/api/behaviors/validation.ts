import { z } from "zod";
import { paginationSchema } from "@/lib/validations/common";

/**
 * Sort field options for behaviors
 */
const behaviorSortFields = ["name", "category", "createdAt"] as const;

/**
 * Sort order options
 */
const sortOrders = ["asc", "desc"] as const;

/**
 * GET request validation schema for behaviors API
 * Validates query parameters for behaviors retrieval
 */
export const getBehaviorsQuerySchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(behaviorSortFields).optional().default("name"),
    order: z.enum(sortOrders).optional().default("asc"),
  })
  .merge(
    paginationSchema.extend({
      // Override the default limit for behaviors
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
 * Type for GET behaviors query parameters
 */
export type GetBehaviorsQueryParams = z.infer<typeof getBehaviorsQuerySchema>;

/**
 * Validation schema for creating a new behavior
 */
export const createBehaviorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
});

/**
 * Type for creating a behavior
 */
export type CreateBehaviorRequest = z.infer<typeof createBehaviorSchema>;

/**
 * Validation schema for updating an existing behavior
 */
export const updateBehaviorSchema = createBehaviorSchema;

/**
 * Type for updating a behavior
 */
export type UpdateBehaviorRequest = z.infer<typeof updateBehaviorSchema>;
