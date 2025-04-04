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
import { clientReplacementPrograms } from "./client-replacement-program.table";

/**
 * Client Replacement Program Behaviors table schema definition
 * Many-to-many relationship between client replacement programs and client behaviors
 */
export const clientReplacementProgramBehaviors = pgTable(
  "client_replacement_program_behaviors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientReplacementProgramId: uuid("client_replacement_program_id")
      .references(() => clientReplacementPrograms.id, {
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
      index: index("client_replacement_program_behavior_index").on(
        table.clientReplacementProgramId,
        table.clientBehaviorId,
      ),
    };
  },
);

/**
 * Define client replacement program behaviors relations
 */
export const clientReplacementProgramBehaviorsRelations = relations(
  clientReplacementProgramBehaviors,
  ({ one }) => ({
    clientReplacementProgram: one(clientReplacementPrograms, {
      fields: [clientReplacementProgramBehaviors.clientReplacementProgramId],
      references: [clientReplacementPrograms.id],
    }),
    clientBehavior: one(clientBehaviors, {
      fields: [clientReplacementProgramBehaviors.clientBehaviorId],
      references: [clientBehaviors.id],
    }),
  }),
);

// Types derived from the schema
export type ClientReplacementProgramBehavior =
  typeof clientReplacementProgramBehaviors.$inferSelect;
export type NewClientReplacementProgramBehavior =
  typeof clientReplacementProgramBehaviors.$inferInsert;

// Zod schemas for validation
export const insertClientReplacementProgramBehaviorSchema = createInsertSchema(
  clientReplacementProgramBehaviors,
  {
    clientReplacementProgramId: z.string().uuid(),
    clientBehaviorId: z.string().uuid(),
  },
).omit({
  id: true,
  createdAt: true,
});

export const selectClientReplacementProgramBehaviorSchema = createSelectSchema(
  clientReplacementProgramBehaviors,
);
