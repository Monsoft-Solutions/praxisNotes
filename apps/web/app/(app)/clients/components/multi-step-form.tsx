"use client";

import { useState, ReactNode, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

export interface Step {
  title: string;
  description: string;
  content: ReactNode;
  isOptional?: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  isSubmitting?: boolean;
  isLastStepSubmitEnabled?: boolean;
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  isSubmitting = false,
  isLastStepSubmitEnabled = true,
}: MultiStepFormProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Mark current step as completed when navigating forward
  useEffect(() => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
  }, [currentStep, completedSteps]);

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Add the final step to completed steps if not already done
    if (!completedSteps.includes(steps.length)) {
      setCompletedSteps((prev) => [...prev, steps.length]);
    }
    onComplete();
  };

  const isLastStep = currentStep === steps.length;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);

          return (
            <div key={index} className="flex flex-col items-center w-full">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <div className="mt-2 text-center w-full">
                <div className="text-sm font-medium">{step.title}</div>
                {isActive && (
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full mt-5 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      {currentStepData && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>{currentStepData.content}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-2">
              {!isLastStep && (
                <Button onClick={goToNextStep} disabled={isSubmitting}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {isLastStep && (
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting || !isLastStepSubmitEnabled}
                >
                  {isSubmitting ? "Submitting..." : "Complete"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
