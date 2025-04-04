import { ApiError } from "./error.type";

/**
 * Standard API response structure
 */
export type ApiResponse<T> = {
  data?: T | undefined;
  error?: ApiError | undefined;
  pagination?:
    | {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      }
    | undefined;
};

/**
 * Pagination parameters
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * Common search parameters
 */
export type SearchParams = {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} & PaginationParams;
