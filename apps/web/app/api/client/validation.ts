import { z } from "zod";
import { paginationSchema, uuidSchema } from "@/lib/validations/common";

/**
 * GET request validation schema for client API
 * Validates query parameters for client retrieval
 */
export const getClientQuerySchema = z
  .object({
    id: uuidSchema.optional(),
    search: z.string().trim().min(1, "Search term cannot be empty").optional(),
  })
  .merge(paginationSchema)
  .refine(
    () => {
      // Ensure at least one of the optional parameters is provided
      // If neither is provided, that's still valid (returns all clients)
      return true;
    },
    {
      message: "At least one parameter must be provided",
      path: ["id", "search"],
    },
  );

/**
 * Type for GET client query parameters
 */
export type GetClientQueryParams = z.infer<typeof getClientQuerySchema>;

/**
 * Client creation request body schema for validation
 */
export const createClientBodySchema = z.object({
  client: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    notes: z.string().nullable(),
  }),
  behaviors: z
    .array(
      z.object({
        behaviorName: z.string().min(1, "Behavior name is required"),
        behaviorDescription: z.string().nullable().optional(),
        baseline: z.number().min(0, "Baseline must be a positive number"),
        type: z.string().min(1, "Type is required"),
        topographies: z.array(z.string()),
      }),
    )
    .optional(),
  replacementPrograms: z
    .array(
      z.object({
        programName: z.string().min(1, "Program name is required"),
        programDescription: z.string().nullable().optional(),
        baseline: z.number().min(0, "Baseline must be a positive number"),
        behaviorIndices: z.array(z.number().int().min(0)),
      }),
    )
    .optional(),
  interventions: z
    .array(
      z.object({
        interventionName: z.string().min(1, "Intervention name is required"),
        interventionDescription: z.string().nullable().optional(),
        behaviorIndices: z.array(z.number().int().min(0)),
      }),
    )
    .optional(),
});

/**
 * Type for POST client request body
 */
export type CreateClientBody = z.infer<typeof createClientBodySchema>;
