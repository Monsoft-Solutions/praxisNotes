"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ReplacementProgram } from "@praxisnotes/database";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Separator } from "@workspace/ui/components/separator";
import { Trash2, PlusCircle } from "lucide-react";

// Validation schema based on the database schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  // Note: Steps are handled separately
});

type FormValues = z.infer<typeof formSchema>;

// Step format for the form's state management
interface Step {
  id: string;
  title: string;
  description: string;
}

interface ReplacementProgramFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replacementProgram?: ReplacementProgram; // If provided, we're editing an existing program
  onSuccess?: () => void; // Callback for after successful submission
}

export function ReplacementProgramForm({
  open,
  onOpenChange,
  replacementProgram,
  onSuccess,
}: ReplacementProgramFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!replacementProgram;
  const [steps, setSteps] = useState<Step[]>([]);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  // Update form values when editing an existing program
  useEffect(() => {
    if (replacementProgram) {
      form.reset({
        name: replacementProgram.name,
        description: replacementProgram.description || "",
        category: replacementProgram.category || "",
      });

      // Convert steps object to array for easier editing
      if (replacementProgram.steps) {
        const stepsArray = Object.entries(
          replacementProgram.steps as Record<string, string>,
        ).map(([key, value]) => ({
          id: crypto.randomUUID(),
          title: key,
          description: value,
        }));
        setSteps(stepsArray);
      } else {
        setSteps([]);
      }
    } else {
      // Reset when creating a new program
      form.reset({
        name: "",
        description: "",
        category: "",
      });
      setSteps([]);
    }
  }, [replacementProgram, form]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const updateStep = (
    id: string,
    field: "title" | "description",
    value: string,
  ) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Convert steps array back to object
      const stepsObject: Record<string, string> = {};
      steps.forEach((step) => {
        if (step.title.trim()) {
          stepsObject[step.title] = step.description;
        }
      });

      const url = isEditing
        ? `/api/replacement-programs/${replacementProgram.id}`
        : "/api/replacement-programs";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          steps: stepsObject,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save replacement program",
        );
      }

      // Show success message
      toast(
        `Replacement program ${isEditing ? "updated" : "created"} successfully`,
      );

      // Close modal and refresh data
      onOpenChange(false);
      form.reset();
      setSteps([]);

      // Callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Refresh the page to update the list
      router.refresh();
    } catch (error) {
      console.error("Error submitting replacement program:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save replacement program",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Replacement Program"
              : "Create Replacement Program"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the replacement program details below."
              : "Fill out the form below to create a new replacement program."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter replacement program name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Program Steps</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  className="flex items-center gap-1"
                >
                  <PlusCircle size={16} />
                  Add Step
                </Button>
              </div>

              {steps.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No steps added yet. Add steps to complete your replacement
                  program.
                </div>
              )}

              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="p-4 border rounded-md space-y-3 relative"
                >
                  <div className="absolute right-2 top-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(step.id)}
                      aria-label="Remove step"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <FormLabel htmlFor={`step-${step.id}-title`}>
                      Step {index + 1} Title
                    </FormLabel>
                    <Input
                      id={`step-${step.id}-title`}
                      value={step.title}
                      onChange={(e) =>
                        updateStep(step.id, "title", e.target.value)
                      }
                      placeholder="Enter step title"
                    />
                  </div>

                  <div className="space-y-2">
                    <FormLabel htmlFor={`step-${step.id}-description`}>
                      Description
                    </FormLabel>
                    <Textarea
                      id={`step-${step.id}-description`}
                      value={step.description}
                      onChange={(e) =>
                        updateStep(step.id, "description", e.target.value)
                      }
                      placeholder="Enter step description"
                      className="resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
