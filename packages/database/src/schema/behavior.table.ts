import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { organizations } from "./organization.table";
import { users } from "./user.table";

/**
 * Behavior table schema definition
 * Represents behaviors that can be assigned to clients
 */
export const behaviors = pgTable("behaviors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  // If organizationId is null, the behavior is considered global
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
 * Define behavior relations
 */
export const behaviorsRelations = relations(behaviors, ({ one }) => ({
  organization: one(organizations, {
    fields: [behaviors.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [behaviors.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [behaviors.updatedBy],
    references: [users.id],
  }),
}));

// Types derived from the schema
export type Behavior = typeof behaviors.$inferSelect;
export type NewBehavior = typeof behaviors.$inferInsert;

// Zod schemas for validation
export const insertBehaviorSchema = createInsertSchema(behaviors, {
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  organizationId: z.string().uuid().optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBehaviorSchema = createSelectSchema(behaviors);
