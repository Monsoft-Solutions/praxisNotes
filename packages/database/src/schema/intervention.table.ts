import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { organizations } from "./organization.table";
import { users } from "./user.table";

/**
 * Intervention table schema definition
 * Represents interventions that can be assigned to clients
 */
export const interventions = pgTable("interventions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  // If organizationId is null, the intervention is considered global
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "set null",
  }),
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
 * Define intervention relations
 */
export const interventionsRelations = relations(interventions, ({ one }) => ({
  organization: one(organizations, {
    fields: [interventions.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [interventions.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [interventions.updatedBy],
    references: [users.id],
  }),
}));

// Types derived from the schema
export type Intervention = typeof interventions.$inferSelect;
export type NewIntervention = typeof interventions.$inferInsert;

// Zod schemas for validation
export const insertInterventionSchema = createInsertSchema(interventions, {
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  organizationId: z.string().uuid().optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectInterventionSchema = createSelectSchema(interventions);
