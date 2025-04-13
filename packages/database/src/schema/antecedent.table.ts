import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { organizations } from "./organization.table";
import { users } from "./user.table";

/**
 * Antecedent table schema definition
 * Represents antecedents that can be assigned to clients
 */
export const antecedents = pgTable("antecedents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  // If organizationId is null, the antecedent is considered global
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

// Define relations for the antecedents table
export const antecedentsRelations = relations(antecedents, ({ one }) => ({
  organization: one(organizations, {
    fields: [antecedents.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [antecedents.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [antecedents.updatedBy],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertAntecedentSchema = createInsertSchema(antecedents, {
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  organizationId: z.string().uuid().optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectAntecedentSchema = createSelectSchema(antecedents);

export type Antecedent = z.infer<typeof selectAntecedentSchema>;
export type NewAntecedent = z.infer<typeof insertAntecedentSchema>;
