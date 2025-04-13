import { z } from "zod";

/**
 * Type definition for ABC Entry
 */
export type ABCEntry = {
  id: string; // Client-side ID for form handling
  activityAntecedent: string;
  behaviors: string[];
  interventions: string[];
  replacementPrograms: string[];
};

/**
 * Session form data type
 */
export type SessionFormData = {
  sessionDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  presentParticipants: string[];
  environmentalChanges: string[];
  abcEntries: ABCEntry[];
  reinforcers: string[];
  valuation: "fair" | "good" | "poor";
};

/**
 * Notes generation request type
 */
export type NotesGenerationRequest = {
  sessionId: string;
  clientId: string;
  template?: string; // Optional template selection
};

/**
 * Notes generation response type
 */
export type NotesGenerationResponse = {
  content: string;
  metadata: {
    modelName: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    reasoning?: string;
  };
};

/**
 * Final session notes data type
 */
export type SessionNotes = {
  id: string;
  sessionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isGenerated: boolean;
};

/**
 * Validation schema for ABC Entry
 */
export const abcEntrySchema = z.object({
  id: z.string(),
  activityAntecedent: z.string().min(1, "Activity/Antecedent is required"),
  behaviors: z.array(z.string()).min(1, "At least one behavior is required"),
  interventions: z.array(z.string()),
  replacementPrograms: z.array(z.string()),
});

/**
 * Validation schema for Session Form
 */
export const sessionFormSchema = z.object({
  sessionDate: z.date({
    required_error: "Session date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  presentParticipants: z.array(z.string()),
  environmentalChanges: z.array(z.string()),
  abcEntries: z
    .array(abcEntrySchema)
    .min(1, "At least one ABC entry is required"),
  reinforcers: z.array(z.string()),
  valuation: z.enum(["fair", "good", "poor"], {
    required_error: "Valuation is required",
  }),
});

/**
 * Type for session form validation schema
 */
export type SessionFormValues = z.infer<typeof sessionFormSchema>;
