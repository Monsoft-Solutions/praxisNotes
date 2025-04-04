/**
 * Client Behavior type definitions
 * These types represent behaviors assigned to clients in the system
 */

/**
 * Base client behavior type with embedded data
 */
export type ClientBehavior = {
  id: string;
  clientId: string;

  // Embedded behavior data
  behaviorName: string;
  behaviorDescription: string | null;

  // Additional fields
  baseline: number;
  type: "frequency" | "percentage";
  topographies: string[] | null;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * Client behavior type for creating a new client behavior
 * Omits system-generated fields
 */
export type NewClientBehavior = Omit<
  ClientBehavior,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Client behavior type for updating an existing client behavior
 * All fields are optional except id
 */
export type UpdateClientBehavior = Partial<Omit<ClientBehavior, "id">> & {
  id: string;
};

/**
 * Client behavior with minimal information
 * Used for dropdowns and simple lists
 */
export type ClientBehaviorSummary = Pick<
  ClientBehavior,
  "id" | "behaviorName" | "baseline" | "type"
>;

/**
 * Form representation of client behavior for multi-step form
 */
export type ClientBehaviorForm = {
  name: string;
  description: string | null;
  baseline: number;
  type: "frequency" | "percentage";
  topographies: string[];
  isNew?: boolean;
};
