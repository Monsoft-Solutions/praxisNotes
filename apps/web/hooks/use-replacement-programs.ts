import useSWR from "swr";
import type { ReplacementProgram } from "@praxisnotes/database";
import { ApiResponse } from "@praxisnotes/types";
import { fetcher } from "@/lib/fetcher";

type ReplacementProgramsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
  targetBehaviorId?: string;
};

/**
 * Hook to fetch replacement programs for the current user
 * Gets both global replacement programs and organization-specific replacement programs
 *
 * @param params Optional parameters for pagination, filtering, and sorting
 */
export function useReplacementPrograms(params?: ReplacementProgramsParams) {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);
    if (params.targetBehaviorId)
      queryParams.append("targetBehaviorId", params.targetBehaviorId);
  }

  const queryString = queryParams.toString();
  const url = `/api/replacement-programs${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<ReplacementProgram[]>
  >(url, fetcher);

  return {
    replacementPrograms: data?.data || [],
    pagination: data?.pagination
      ? {
          page: data.pagination.page || 1,
          limit: data.pagination.limit || 50,
          total: data.pagination.total || 0,
          totalPages: data.pagination.totalPages || 0,
        }
      : null,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
