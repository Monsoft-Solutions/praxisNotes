import { z } from "zod";

// ABC Entry schema
export const abcEntrySchema = z.object({
  id: z.string(),
  activityAntecedent: z.string().optional(),
  behaviors: z.string().array(),
  interventions: z.string().array(),
  replacementPrograms: z.string().array(),
});

export type ABCEntry = z.infer<typeof abcEntrySchema>;

// Session form schema
export const sessionFormSchema = z.object({
  sessionDate: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  presentParticipants: z.string().array(),
  environmentalChanges: z.string().array(),
  abcEntries: z
    .array(abcEntrySchema)
    .min(1, "At least one ABC entry is required"),
  reinforcers: z.string().array(),
  valuation: z.enum(["fair", "good", "poor"]),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;

// Notes generation request schema
export const notesGenerationRequestSchema = z.object({
  sessionId: z.string().uuid(),
  clientId: z.string().uuid(),
});

export type NotesGenerationRequest = z.infer<
  typeof notesGenerationRequestSchema
>;

// Session notes schema
export const sessionNotesSchema = z.object({
  id: z.string().uuid().optional(),
  sessionId: z.string().uuid(),
  content: z.string(),
  isGenerated: z.boolean().default(true),
  generationMetadata: z.any().optional(),
});

export type SessionNotes = z.infer<typeof sessionNotesSchema>;
