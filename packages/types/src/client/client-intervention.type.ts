/**
 * Client Intervention type definitions
 * These types represent interventions assigned to clients in the system
 */

/**
 * Base client intervention type with embedded data
 */
export type ClientIntervention = {
  id: string;
  clientId: string;

  // Embedded intervention data
  interventionName: string;
  interventionDescription: string | null;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * Client intervention type for creating a new client intervention
 * Omits system-generated fields
 */
export type NewClientIntervention = Omit<
  ClientIntervention,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // For creation only - will be used to create relationships
  behaviorIds?: string[];
};

/**
 * Client intervention type for updating an existing client intervention
 * All fields are optional except id
 */
export type UpdateClientIntervention = Partial<
  Omit<ClientIntervention, "id">
> & {
  id: string;
  behaviorIds?: string[]; // Optional behavior IDs for updating associations
};

/**
 * Client intervention with minimal information
 * Used for dropdowns and simple lists
 */
export type ClientInterventionSummary = Pick<
  ClientIntervention,
  "id" | "interventionName"
>;

/**
 * Client intervention with associated behaviors
 */
export type ClientInterventionWithBehaviors = ClientIntervention & {
  behaviors: ClientInterventionBehavior[];
};

/**
 * Client intervention behavior relationship
 */
export type ClientInterventionBehavior = {
  id: string;
  clientInterventionId: string;
  clientBehaviorId: string;
  createdAt: Date;
};

/**
 * Form representation of client intervention for multi-step form
 */
export type ClientInterventionForm = {
  name: string;
  description: string | null;
  behaviorIndices: number[]; // Indices of behaviors from step 2
  isNew?: boolean;
};
