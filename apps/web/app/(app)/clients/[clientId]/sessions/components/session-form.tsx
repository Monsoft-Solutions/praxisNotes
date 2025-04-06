"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { SessionFormValues, sessionFormSchema } from "@praxisnotes/types";
import { Button } from "@workspace/ui/components/button";
import { SessionHeader } from "./session-header";
import { SessionBasicInfo } from "./session-basic-info";
import { ABCCardContainer } from "./abc-card-container";
import { ReinforcersSection } from "./reinforcers-section";
import { ValuationSelector } from "./valuation-selector";

interface SessionFormProps {
  clientId: string;
  clientName: string;
}

export function SessionForm({ clientId, clientName }: SessionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize form with default values
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      sessionDate: new Date(),
      startTime: "",
      endTime: "",
      location: "",
      presentParticipants: [],
      environmentalChanges: [],
      abcEntries: [
        {
          id: uuidv4(),
          activityAntecedent: "",
          behaviors: [],
          interventions: [],
          replacementPrograms: [],
        },
      ],
      reinforcers: [],
      valuation: "good",
    },
  });

  // Handle saving as draft
  const handleSaveDraft = async (data: SessionFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/client/${clientId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "draft",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save session");
      }

      const sessionData = await response.json();

      toast.success("Session saved as draft");
      router.refresh();
      router.push(`/clients/${clientId}/sessions/${sessionData.data.id}`);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save session",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle generating notes
  const handleGenerateNotes = async (data: SessionFormValues) => {
    setIsGenerating(true);

    try {
      // First save the session to get a session ID
      const saveResponse = await fetch(`/api/client/${clientId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "submitted",
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || "Failed to save session");
      }

      const sessionData = await saveResponse.json();
      const sessionId = sessionData.data.id;

      // Then generate notes
      const generateResponse = await fetch(
        `/api/client/${clientId}/sessions/${sessionId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            clientId,
          }),
        },
      );

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.message || "Failed to generate notes");
      }

      toast.success("Notes generated successfully");
      router.refresh();
      router.push(`/clients/${clientId}/sessions/${sessionId}/notes`);
    } catch (error) {
      console.error("Error generating notes:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate notes",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    router.back();
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-8">
        <SessionHeader clientName={clientName} />

        <SessionBasicInfo />

        <ABCCardContainer />

        <ReinforcersSection />

        <ValuationSelector />

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={form.handleSubmit(handleSaveDraft)}
            disabled={isSubmitting || isGenerating}
            className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            onClick={form.handleSubmit(handleGenerateNotes)}
            disabled={isSubmitting || isGenerating}
            className={isGenerating ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isGenerating ? "Generating..." : "Generate Notes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
