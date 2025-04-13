// NextAuth types
export * from "./next-auth/next-auth.type";

// API types
export * from "./common/response.type";
export * from "./common/error.type";
export * from "./common/api.type";
export * from "./common/form.type";

// Session types
export * from "./session";

// Re-export important session types directly for backward compatibility
export type {
  SessionFormData,
  ABCEntry,
  NotesGenerationRequest,
  NotesGenerationResponse,
  SessionNotes,
} from "./session/session-form.type";
