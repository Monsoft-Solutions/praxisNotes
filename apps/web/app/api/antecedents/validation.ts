import { z } from "zod";
import { paginationSchema } from "@/lib/validations/common";

/**
 * Sort field options for antecedents
 */
const antecedentSortFields = ["name", "category", "createdAt"] as const;

/**
 * Sort order options
 */
const sortOrders = ["asc", "desc"] as const;

/**
 * GET request validation schema for antecedents API
 * Validates query parameters for antecedents retrieval
 */
export const getAntecedentsQuerySchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(antecedentSortFields).optional().default("name"),
    order: z.enum(sortOrders).optional().default("asc"),
  })
  .merge(
    paginationSchema.extend({
      // Override the default limit for antecedents
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
 * POST request validation schema for creating a new antecedent
 */
export const createAntecedentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
});

/**
 * Type for creating an antecedent
 */
export type CreateAntecedentRequest = z.infer<typeof createAntecedentSchema>;

/**
 * PATCH request validation schema for updating an existing antecedent
 */
export const updateAntecedentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
});

/**
 * Type for updating an antecedent
 */
export type UpdateAntecedentRequest = z.infer<typeof updateAntecedentSchema>;
