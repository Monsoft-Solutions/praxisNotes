import {
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { organizations } from "./organization.table";
import { users } from "./user.table";
import { behaviors } from "./behavior.table";

/**
 * Replacement Program table schema definition
 * Represents replacement programs that can be assigned to clients to replace challenging behaviors
 */
export const replacementPrograms = pgTable("replacement_programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  // If organizationId is null, the replacement program is considered global
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "set null",
  }),
  steps: json("steps"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),
  updatedBy: uuid("updated_by")
    .references(() => users.id)
    .notNull(),
});

/**
 * Define replacement program relations
 */
export const replacementProgramsRelations = relations(
  replacementPrograms,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [replacementPrograms.organizationId],
      references: [organizations.id],
    }),
    creator: one(users, {
      fields: [replacementPrograms.createdBy],
      references: [users.id],
    }),
    updater: one(users, {
      fields: [replacementPrograms.updatedBy],
      references: [users.id],
    }),
  }),
);

// Types derived from the schema
export type ReplacementProgram = typeof replacementPrograms.$inferSelect;
export type NewReplacementProgram = typeof replacementPrograms.$inferInsert;

// Zod schemas for validation
export const insertReplacementProgramSchema = createInsertSchema(
  replacementPrograms,
  {
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    category: z.string().max(100).optional(),
    organizationId: z.string().uuid().optional().nullable(),
    steps: z.record(z.string()).optional(),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectReplacementProgramSchema =
  createSelectSchema(replacementPrograms);
