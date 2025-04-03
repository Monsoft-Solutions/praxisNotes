import { z } from "zod";

/**
 * Common pagination parameters schema
 * Used for standardizing pagination across API endpoints
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(
      z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number (starts from 1)"),
    ),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int()
        .positive()
        .max(100)
        .default(10)
        .describe("Number of items per page (max 100)"),
    ),
});

/**
 * Pagination result type
 */
export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * UUID schema for ID validation
 */
export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    "Invalid UUID format",
  );
