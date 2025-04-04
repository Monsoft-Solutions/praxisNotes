import {
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { clients } from "./client.table";

/**
 * Client Replacement Program table schema definition
 * Represents replacement programs assigned to clients with embedded data
 */
export const clientReplacementPrograms = pgTable(
  "client_replacement_programs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientId: uuid("client_id")
      .references(() => clients.id, {
        onDelete: "cascade",
      })
      .notNull(),

    // Embedded replacement program data
    programName: varchar("program_name", { length: 255 }).notNull(),
    programDescription: text("program_description"),

    // Additional fields
    baseline: numeric("baseline").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);

/**
 * Define client replacement program relations
 */
export const clientReplacementProgramsRelations = relations(
  clientReplacementPrograms,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientReplacementPrograms.clientId],
      references: [clients.id],
    }),
  }),
);

// Types derived from the schema
export type ClientReplacementProgram =
  typeof clientReplacementPrograms.$inferSelect;
export type NewClientReplacementProgram =
  typeof clientReplacementPrograms.$inferInsert;

// Zod schemas for validation
export const insertClientReplacementProgramSchema = createInsertSchema(
  clientReplacementPrograms,
  {
    programName: z.string().min(1).max(255),
    programDescription: z.string().optional(),
    baseline: z.number().positive(),
    clientId: z.string().uuid(),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectClientReplacementProgramSchema = createSelectSchema(
  clientReplacementPrograms,
);
