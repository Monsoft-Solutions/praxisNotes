import { z } from "zod";
import { paginationSchema } from "@/lib/validations/common";

/**
 * Sort field options for interventions
 */
const interventionSortFields = ["name", "category", "createdAt"] as const;

/**
 * Sort order options
 */
const sortOrders = ["asc", "desc"] as const;

/**
 * GET request validation schema for interventions API
 * Validates query parameters for interventions retrieval
 */
export const getInterventionsQuerySchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(interventionSortFields).optional().default("name"),
    order: z.enum(sortOrders).optional().default("asc"),
  })
  .merge(
    paginationSchema.extend({
      // Override the default limit for interventions
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
 * Type for GET interventions query parameters
 */
export type GetInterventionsQueryParams = z.infer<
  typeof getInterventionsQuerySchema
>;

/**
 * Validation schema for creating a new intervention
 */
export const createInterventionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
});

/**
 * Type for creating an intervention
 */
export type CreateInterventionRequest = z.infer<
  typeof createInterventionSchema
>;

/**
 * Validation schema for updating an existing intervention
 */
export const updateInterventionSchema = createInterventionSchema;

/**
 * Type for updating an intervention
 */
export type UpdateInterventionRequest = z.infer<
  typeof updateInterventionSchema
>;
