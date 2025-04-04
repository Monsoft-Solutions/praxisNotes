import {
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { clients } from "./client.table";

/**
 * Client Behavior table schema definition
 * Represents behaviors assigned to clients with embedded behavior data
 */
export const clientBehaviors = pgTable("client_behaviors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Embedded behavior data
  behaviorName: varchar("behavior_name", { length: 255 }).notNull(),
  behaviorDescription: text("behavior_description"),

  // Additional fields
  baseline: numeric("baseline").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  topographies: jsonb("topographies"), // Array of strings stored as JSONB

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define client behavior relations
 */
export const clientBehaviorsRelations = relations(
  clientBehaviors,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientBehaviors.clientId],
      references: [clients.id],
    }),
  }),
);

// Types derived from the schema
export type ClientBehavior = typeof clientBehaviors.$inferSelect;
export type NewClientBehavior = typeof clientBehaviors.$inferInsert;

// Zod schemas for validation
export const insertClientBehaviorSchema = createInsertSchema(clientBehaviors, {
  behaviorName: z.string().min(1).max(255),
  behaviorDescription: z.string().optional(),
  baseline: z.number().positive(),
  type: z.enum(["frequency", "percentage"]),
  topographies: z.array(z.string()).optional().nullable(),
  clientId: z.string().uuid(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectClientBehaviorSchema = createSelectSchema(clientBehaviors);
