import useSWR from "swr";
import { Behavior } from "@praxisnotes/database";
import { ApiResponse } from "@praxisnotes/types";
import { fetcher } from "@/lib/fetcher";

type BehaviorsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
};

/**
 * Hook to fetch behaviors for the current user
 * Gets both global behaviors and organization-specific behaviors
 *
 * @param params Optional parameters for pagination, filtering, and sorting
 */
export function useBehaviors(params?: BehaviorsParams) {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);
  }

  const queryString = queryParams.toString();
  const url = `/api/behaviors${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Behavior[]>>(
    url,
    fetcher,
  );

  return {
    behaviors: data?.data || [],
    pagination: data?.meta
      ? {
          page: data.meta.page || 1,
          perPage: data.meta.perPage || 50,
          total: data.meta.total || 0,
          totalPages: data.meta.totalPages || 0,
        }
      : null,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
