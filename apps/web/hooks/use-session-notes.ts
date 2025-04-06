import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "@/lib/fetcher";

interface SessionNotesResponse {
  id: string;
  sessionId: string;
  content: string;
  isGenerated: boolean;
  generationMetadata?: any;
  createdAt: string;
  updatedAt: string;
}

export function useSessionNotes(
  clientId?: string,
  sessionId?: string,
  initialData?: SessionNotesResponse,
) {
  const shouldFetch = !!clientId && !!sessionId;

  const { data, error, isLoading, mutate } = useSWR<SessionNotesResponse>(
    shouldFetch ? `/api/client/${clientId}/sessions/${sessionId}/notes` : null,
    fetcher,
    { fallbackData: initialData },
  );

  // Generate notes mutation
  const { trigger: generateNotes, isMutating: isGenerating } = useSWRMutation(
    shouldFetch ? `/api/client/${clientId}/sessions/${sessionId}/notes` : null,
    async (url) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate notes");
      }

      const result = await response.json();
      mutate(result.data);
      return result.data;
    },
  );

  // Update notes mutation
  const { trigger: updateNotes, isMutating: isUpdating } = useSWRMutation(
    shouldFetch ? `/api/client/${clientId}/sessions/${sessionId}/notes` : null,
    async (url, { arg }: { arg: { content: string } }) => {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update notes");
      }

      const result = await response.json();
      mutate(result.data);
      return result.data;
    },
  );

  return {
    notes: data,
    isLoading,
    isError: !!error,
    error,
    isGenerating,
    isUpdating,
    isMutating: isGenerating || isUpdating,
    generateNotes,
    updateNotes,
    mutate,
  };
}
