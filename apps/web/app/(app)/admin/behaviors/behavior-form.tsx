"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Behavior } from "@praxisnotes/database";
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

interface BehaviorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  behavior?: Behavior; // If provided, we're editing an existing behavior
  onSuccess?: () => void; // Callback for after successful submission
}

export function BehaviorForm({
  open,
  onOpenChange,
  behavior,
  onSuccess,
}: BehaviorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!behavior;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  // Update form values when editing an existing behavior
  useEffect(() => {
    if (behavior) {
      form.reset({
        name: behavior.name,
        description: behavior.description || "",
        category: behavior.category || "",
      });
    }
  }, [behavior, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/behaviors/${behavior.id}`
        : "/api/behaviors";

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
        throw new Error(errorData.message || "Failed to save behavior");
      }

      // Show success message
      toast(`Behavior ${isEditing ? "updated" : "created"} successfully`);

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
      console.error("Error submitting behavior:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save behavior",
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
            {isEditing ? "Edit Behavior" : "Create Behavior"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the behavior details below."
              : "Fill out the form below to create a new behavior."}
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
                    <Input placeholder="Enter behavior name" {...field} />
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
