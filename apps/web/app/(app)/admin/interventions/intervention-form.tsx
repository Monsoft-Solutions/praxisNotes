"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Intervention } from "@praxisnotes/database";
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

// Validation schema based on the database schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InterventionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intervention?: Intervention; // If provided, we're editing an existing intervention
  onSuccess?: () => void; // Callback for after successful submission
}

export function InterventionForm({
  open,
  onOpenChange,
  intervention,
  onSuccess,
}: InterventionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!intervention;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  // Update form values when editing an existing intervention
  useEffect(() => {
    if (intervention) {
      form.reset({
        name: intervention.name,
        description: intervention.description || "",
        category: intervention.category || "",
      });
    }
  }, [intervention, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/interventions/${intervention.id}`
        : "/api/interventions";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save intervention");
      }

      // Show success message
      toast(`Intervention ${isEditing ? "updated" : "created"} successfully`);

      // Close modal and refresh data
      onOpenChange(false);
      form.reset();

      // Callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Refresh the page to update the list
      router.refresh();
    } catch (error) {
      console.error("Error submitting intervention:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save intervention",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Intervention" : "Create Intervention"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the intervention details below."
              : "Fill out the form below to create a new intervention."}
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
                    <Input placeholder="Enter intervention name" {...field} />
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
