/**
 * Client Replacement Program type definitions
 * These types represent replacement programs assigned to clients in the system
 */

/**
 * Base client replacement program type with embedded data
 */
export type ClientReplacementProgram = {
  id: string;
  clientId: string;

  // Embedded replacement program data
  programName: string;
  programDescription: string | null;

  // Additional fields
  baseline: number;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * Client replacement program type for creating a new client replacement program
 * Omits system-generated fields
 */
export type NewClientReplacementProgram = Omit<
  ClientReplacementProgram,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // For creation only - will be used to create relationships
  behaviorIds?: string[];
};

/**
 * Client replacement program type for updating an existing client replacement program
 * All fields are optional except id
 */
export type UpdateClientReplacementProgram = Partial<
  Omit<ClientReplacementProgram, "id">
> & {
  id: string;
  behaviorIds?: string[]; // Optional behavior IDs for updating associations
};

/**
 * Client replacement program with minimal information
 * Used for dropdowns and simple lists
 */
export type ClientReplacementProgramSummary = Pick<
  ClientReplacementProgram,
  "id" | "programName" | "baseline"
>;

/**
 * Client replacement program with associated behaviors
 */
export type ClientReplacementProgramWithBehaviors = ClientReplacementProgram & {
  behaviors: ClientReplacementProgramBehavior[];
};

/**
 * Client replacement program behavior relationship
 */
export type ClientReplacementProgramBehavior = {
  id: string;
  clientReplacementProgramId: string;
  clientBehaviorId: string;
  createdAt: Date;
};

/**
 * Form representation of client replacement program for multi-step form
 */
export type ClientReplacementProgramForm = {
  name: string;
  description: string | null;
  baseline: number;
  behaviorIndices: number[]; // Indices of behaviors from step 2
  isNew?: boolean;
};
