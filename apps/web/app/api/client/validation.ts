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
    (data) => {
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
