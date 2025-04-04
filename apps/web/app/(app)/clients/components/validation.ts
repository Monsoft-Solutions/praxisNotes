import { z } from "zod";

/**
 * Basic client information schema
 */
export const clientBasicInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(255),
  lastName: z.string().min(1, "Last name is required").max(255),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  notes: z.string().optional().or(z.literal("")),
});

/**
 * Client behavior form schema
 */
export const clientBehaviorSchema = z.object({
  name: z.string().min(1, "Behavior name is required").max(255),
  description: z.string().optional().nullable(),
  baseline: z.coerce.number().min(0, "Baseline must be a positive number"),
  type: z.enum(["frequency", "percentage"], {
    required_error: "Please select a behavior type",
  }),
  topographies: z.array(z.string()).default([]),
  isNew: z.boolean().optional(),
});

/**
 * Client replacement program schema
 */
export const clientReplacementProgramSchema = z.object({
  name: z.string().min(1, "Program name is required").max(255),
  description: z.string().optional().nullable(),
  baseline: z.coerce.number().min(0, "Baseline must be a positive number"),
  behaviorIndices: z.array(z.number()).default([]),
  isNew: z.boolean().optional(),
});

/**
 * Client intervention schema
 */
export const clientInterventionSchema = z.object({
  name: z.string().min(1, "Intervention name is required").max(255),
  description: z.string().optional().nullable(),
  behaviorIndices: z.array(z.number()).default([]),
  isNew: z.boolean().optional(),
});

/**
 * Complete client form schema
 */
export const clientFormSchema = z.object({
  // Step 1: Basic Info
  ...clientBasicInfoSchema.shape,

  // Step 2: Behaviors
  behaviors: z.array(clientBehaviorSchema).default([]),

  // Step 3: Replacement Programs
  replacementPrograms: z.array(clientReplacementProgramSchema).default([]),

  // Step 4: Interventions
  interventions: z.array(clientInterventionSchema).default([]),

  // Form progression
  currentStep: z.number().min(1).max(5),
  isComplete: z.boolean(),
});

// Type definitions
export type ClientBasicInfoFormValues = z.infer<typeof clientBasicInfoSchema>;
export type ClientBehaviorFormValues = z.infer<typeof clientBehaviorSchema>;
export type ClientReplacementProgramFormValues = z.infer<
  typeof clientReplacementProgramSchema
>;
export type ClientInterventionFormValues = z.infer<
  typeof clientInterventionSchema
>;
export type ClientFormValues = z.infer<typeof clientFormSchema>;
