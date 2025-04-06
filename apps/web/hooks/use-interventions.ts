import useSWR from "swr";
import { Intervention } from "@praxisnotes/database";
import { ApiResponse } from "@praxisnotes/types";
import { fetcher } from "@/lib/fetcher";

type InterventionsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
};

/**
 * Hook to fetch interventions for the current user
 * Gets both global interventions and organization-specific interventions
 *
 * @param params Optional parameters for pagination, filtering, and sorting
 */
export function useInterventions(params?: InterventionsParams) {
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
  const url = `/api/interventions${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<Intervention[]>
  >(url, fetcher);

  return {
    interventions: data?.data || [],
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

/**
 * Hook to fetch a single intervention by ID
 */
export function useIntervention(id: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Intervention>>(
    id ? `/api/interventions/${id}` : null,
    fetcher,
  );

  return {
    intervention: data?.data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
