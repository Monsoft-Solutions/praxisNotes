"use client";

import { useState, useRef, useEffect } from "react";
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
import { useCreateClient, ClientSubmission } from "@/hooks/use-clients";
import { useBehaviors } from "@/hooks/use-behaviors";
import { useReplacementPrograms } from "@/hooks/use-replacement-programs";
import { useInterventions } from "@/hooks/use-interventions";

export function ClientForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { behaviors } = useBehaviors();
  const { replacementPrograms } = useReplacementPrograms();
  const { interventions } = useInterventions();
  const { createClientAndRedirect } = useCreateClient();
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema) as any,
    mode: "onChange",
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
    shouldUnregister: false,
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
      content: <ClientBehaviorsForm existingBehaviors={behaviors} />,
    },
    {
      title: "Programs",
      description: "Add replacement programs",
      content: (
        <ClientReplacementProgramsForm existingPrograms={replacementPrograms} />
      ),
    },
    {
      title: "Interventions",
      description: "Add interventions",
      content: (
        <ClientInterventionsForm existingInterventions={interventions} />
      ),
    },
    {
      title: "Review",
      description: "Review all information",
      content: <ClientReviewSummary />,
    },
  ];

  const handleStepChange = async (step: number) => {
    console.log(
      `Attempting to change from step ${currentStep} to step ${step}`,
    );

    // If going backwards, always allow it
    if (step < currentStep) {
      console.log("Going back to previous step");
      form.setValue("currentStep", step);
      return;
    }

    // If trying to go to a next step, validate the current step first
    if (step > currentStep) {
      // Different validation for each step
      if (currentStep === 1) {
        // Basic info step validation - validate specific fields
        console.log("Validating basic info fields");

        // Manually validate required fields
        const firstName = form.getValues("firstName");
        const lastName = form.getValues("lastName");

        if (!firstName || firstName.trim() === "") {
          form.setError("firstName", {
            type: "manual",
            message: "First name is required",
          });
          console.log("First name validation failed");
          return;
        }

        if (!lastName || lastName.trim() === "") {
          form.setError("lastName", {
            type: "manual",
            message: "Last name is required",
          });
          console.log("Last name validation failed");
          return;
        }

        console.log("Basic info validation passed");
      }
    }

    // If validation passes or going back, update the step
    console.log(`Setting form value for currentStep to ${step}`);
    form.setValue("currentStep", step);

    // Clear validation errors when moving to new step
    form.clearErrors();
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const formData = form.getValues();

      // Transform data for the API
      const clientSubmission: ClientSubmission = {
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

      // Use the hook to create client and handle redirection
      await createClientAndRedirect(clientSubmission);
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

  // Effect to preserve scroll position when steps change
  useEffect(() => {
    if (formRef.current) {
      // Scroll to top of form with a small delay to ensure render completes
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [currentStep]);

  return (
    <FormProvider {...form}>
      <div className="space-y-8" ref={formRef}>
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
          isLastStepSubmitEnabled={isLastStepSubmitEnabled}
        />
      </div>
    </FormProvider>
  );
}
