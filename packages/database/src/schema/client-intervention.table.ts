import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { clients } from "./client.table";

/**
 * Client Intervention table schema definition
 * Represents interventions assigned to clients with embedded data
 */
export const clientInterventions = pgTable("client_interventions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Embedded intervention data
  interventionName: varchar("intervention_name", { length: 255 }).notNull(),
  interventionDescription: text("intervention_description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define client intervention relations
 */
export const clientInterventionsRelations = relations(
  clientInterventions,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientInterventions.clientId],
      references: [clients.id],
    }),
  }),
);

// Types derived from the schema
export type ClientIntervention = typeof clientInterventions.$inferSelect;
export type NewClientIntervention = typeof clientInterventions.$inferInsert;

// Zod schemas for validation
export const insertClientInterventionSchema = createInsertSchema(
  clientInterventions,
  {
    interventionName: z.string().min(1).max(255),
    interventionDescription: z.string().optional(),
    clientId: z.string().uuid(),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectClientInterventionSchema =
  createSelectSchema(clientInterventions);
