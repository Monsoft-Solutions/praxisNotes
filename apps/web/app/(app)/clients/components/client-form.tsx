"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MultiStepForm, Step } from "./multi-step-form";
import { ClientBasicInfoForm } from "./client-basic-info-form";
import { ClientBehaviorsForm } from "./client-behaviors-form";
import { ClientReplacementProgramsForm } from "./client-replacement-programs-form";
import { ClientInterventionsForm } from "./client-interventions-form";
import { ClientReviewSummary } from "./client-review-summary";
import { clientFormSchema, ClientFormValues } from "./validation";

export function ClientForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema) as any,
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      notes: "",
      behaviors: [],
      replacementPrograms: [],
      interventions: [],
      currentStep: 1,
      isComplete: false,
    },
  });

  const currentStep = form.watch("currentStep");

  const steps: Step[] = [
    {
      title: "Basic Info",
      description: "Add client's basic information",
      content: <ClientBasicInfoForm />,
    },
    {
      title: "Behaviors",
      description: "Add behaviors for this client",
      content: <ClientBehaviorsForm />,
    },
    {
      title: "Programs",
      description: "Add replacement programs",
      content: <ClientReplacementProgramsForm />,
    },
    {
      title: "Interventions",
      description: "Add interventions",
      content: <ClientInterventionsForm />,
    },
    {
      title: "Review",
      description: "Review all information",
      content: <ClientReviewSummary />,
    },
  ];

  const handleStepChange = (step: number) => {
    console.log("setting the value of currentStep to", step);
    form.setValue("currentStep", step);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const formData = form.getValues();

      // Transform data for the API
      const clientSubmission = {
        client: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          notes: formData.notes || null,
        },
        behaviors: formData.behaviors?.map((b) => ({
          behaviorName: b.name,
          behaviorDescription: b.description,
          baseline: b.baseline,
          type: b.type,
          topographies: b.topographies,
        })),
        replacementPrograms: formData.replacementPrograms?.map((p) => ({
          programName: p.name,
          programDescription: p.description,
          baseline: p.baseline,
          behaviorIndices: p.behaviorIndices,
        })),
        interventions: formData.interventions?.map((i) => ({
          interventionName: i.name,
          interventionDescription: i.description,
          behaviorIndices: i.behaviorIndices,
        })),
      };

      // Send to API
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientSubmission),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create client");
      }

      const data = await response.json();

      // Show success message
      toast.success("Client created successfully");

      // Redirect to client detail page
      router.push(`/clients/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the client",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if the last step submission should be enabled
  const isLastStepSubmitEnabled = form.formState.isValid;

  return (
    <FormProvider {...form}>
      <form className="space-y-8">
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
          isLastStepSubmitEnabled={isLastStepSubmitEnabled}
        />
      </form>
    </FormProvider>
  );
}
