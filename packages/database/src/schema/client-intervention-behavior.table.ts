import {
  pgTable,
  timestamp,
  uuid,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { clientBehaviors } from "./client-behavior.table";
import { clientInterventions } from "./client-intervention.table";

/**
 * Client Intervention Behaviors table schema definition
 * Many-to-many relationship between client interventions and client behaviors
 */
export const clientInterventionBehaviors = pgTable(
  "client_intervention_behaviors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientInterventionId: uuid("client_intervention_id")
      .references(() => clientInterventions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    clientBehaviorId: uuid("client_behavior_id")
      .references(() => clientBehaviors.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      // Add a composite unique constraint to prevent duplicate associations
      index: index("client_intervention_behavior_index").on(
        table.clientInterventionId,
        table.clientBehaviorId,
      ),
    };
  },
);

/**
 * Define client intervention behaviors relations
 */
export const clientInterventionBehaviorsRelations = relations(
  clientInterventionBehaviors,
  ({ one }) => ({
    clientIntervention: one(clientInterventions, {
      fields: [clientInterventionBehaviors.clientInterventionId],
      references: [clientInterventions.id],
    }),
    clientBehavior: one(clientBehaviors, {
      fields: [clientInterventionBehaviors.clientBehaviorId],
      references: [clientBehaviors.id],
    }),
  }),
);

// Types derived from the schema
export type ClientInterventionBehavior =
  typeof clientInterventionBehaviors.$inferSelect;
export type NewClientInterventionBehavior =
  typeof clientInterventionBehaviors.$inferInsert;

// Zod schemas for validation
export const insertClientInterventionBehaviorSchema = createInsertSchema(
  clientInterventionBehaviors,
  {
    clientInterventionId: z.string().uuid(),
    clientBehaviorId: z.string().uuid(),
  },
).omit({
  id: true,
  createdAt: true,
});

export const selectClientInterventionBehaviorSchema = createSelectSchema(
  clientInterventionBehaviors,
);
