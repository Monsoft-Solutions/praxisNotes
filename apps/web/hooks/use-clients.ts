import useSWR from "swr";
import { Client } from "@praxisnotes/database";
import { ApiResponse } from "@praxisnotes/types";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ClientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
};

/**
 * Hook to fetch clients for the current user
 *
 * @param params Optional parameters for pagination, filtering, and sorting
 */
export function useClients(params?: ClientsParams) {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);
  }

  const queryString = queryParams.toString();
  const url = `/api/client${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Client[]>>(
    url,
    fetcher,
  );

  return {
    clients: data?.data || [],
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
 * Type for client creation data
 */
export type ClientSubmission = {
  client: {
    firstName: string;
    lastName: string;
    gender: string;
    notes: string | null;
  };
  behaviors?: Array<{
    behaviorName: string;
    behaviorDescription: string | null | undefined;
    baseline: number;
    type: string;
    topographies: string[];
  }>;
  replacementPrograms?: Array<{
    programName: string;
    programDescription: string | null | undefined;
    baseline: number;
    behaviorIndices: number[];
  }>;
  interventions?: Array<{
    interventionName: string;
    interventionDescription: string | null | undefined;
    behaviorIndices: number[];
  }>;
};

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const router = useRouter();

  const createClient = async (data: ClientSubmission) => {
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create client");
      }

      const responseData = await response.json();

      // Show success message
      toast.success("Client created successfully");

      // Return the created client data
      return { success: true, data: responseData.data };
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the client",
      );
      return { success: false, error };
    }
  };

  const createClientAndRedirect = async (data: ClientSubmission) => {
    const result = await createClient(data);

    if (result.success && result.data) {
      // Redirect to client detail page
      router.push(`/clients/${result.data.id}`);
      router.refresh();
    }

    return result;
  };

  return {
    createClient,
    createClientAndRedirect,
  };
}
