import {
  pgTable,
  uuid,
  timestamp,
  text,
  varchar,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { clients } from "./client.table";
import { users } from "./user.table";
import { sessionStatusEnum } from "../enums/session-status.enum";

/**
 * Sessions table schema definition
 * Stores session data for client sessions
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Reference to the client
  clientId: uuid("client_id")
    .references(() => clients.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Reference to the user/therapist who conducted the session
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Session metadata
  sessionDate: timestamp("session_date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),

  // Status of the session
  status: sessionStatusEnum("status").notNull().default("draft"),

  // Session form data (stored as JSON)
  formData: jsonb("form_data").notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdBy: uuid("created_by")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  updatedBy: uuid("updated_by")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

/**
 * Session ABCs table schema definition
 * Stores Antecedent-Behavior-Consequence data related to sessions
 */
export const sessionABCs = pgTable("session_abcs", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Reference to the session
  sessionId: uuid("session_id")
    .references(() => sessions.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // ABC components
  antecedent: text("antecedent").notNull(),
  behavior: text("behavior").notNull(),
  consequence: text("consequence").notNull(),

  // Optional additional context
  contextNotes: text("context_notes"),

  // Sequential order within a session (if multiple ABCs)
  sequenceOrder: integer("sequence_order"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Session notes table schema definition
 * Stores generated notes for sessions
 */
export const sessionNotes = pgTable("session_notes", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Reference to the session
  sessionId: uuid("session_id")
    .references(() => sessions.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Content of the notes
  content: text("content").notNull(),

  // Metadata for AI-generated notes
  generationMetadata: jsonb("generation_metadata"),

  // Whether the notes were AI-generated
  isGenerated: boolean("is_generated").default(true).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define session relations
 */
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  client: one(clients, {
    fields: [sessions.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [sessions.createdBy],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [sessions.updatedBy],
    references: [users.id],
  }),
  notes: many(sessionNotes),
  abcs: many(sessionABCs),
}));

/**
 * Define session notes relations
 */
export const sessionNotesRelations = relations(sessionNotes, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionNotes.sessionId],
    references: [sessions.id],
  }),
}));

/**
 * Define session ABCs relations
 */
export const sessionABCsRelations = relations(sessionABCs, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionABCs.sessionId],
    references: [sessions.id],
  }),
}));

// Zod schemas for validation
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export const insertSessionNotesSchema = createInsertSchema(sessionNotes);
export const selectSessionNotesSchema = createSelectSchema(sessionNotes);

export const insertSessionABCsSchema = createInsertSchema(sessionABCs);
export const selectSessionABCsSchema = createSelectSchema(sessionABCs);
