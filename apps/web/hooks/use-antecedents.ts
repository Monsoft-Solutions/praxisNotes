import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@praxisnotes/types";
import { Antecedent } from "@praxisnotes/database";

// Define params interface
interface AntecedentsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "name" | "category" | "createdAt";
  order?: "asc" | "desc";
}

/**
 * Hook to fetch antecedents for the current user
 * Gets both global antecedents and organization-specific antecedents
 *
 * @param params Optional parameters for pagination, filtering, and sorting
 */
export function useAntecedents(params?: AntecedentsParams) {
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
  const url = `/api/antecedents${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Antecedent[]>>(
    url,
    fetcher,
  );

  return {
    antecedents: data?.data || [],
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
