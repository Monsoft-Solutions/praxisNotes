/**
 * Client Form type definitions
 * These types are used for the multi-step client creation form
 */

import { ClientBehaviorForm } from "./client-behavior.type";
import { ClientInterventionForm } from "./client-intervention.type";
import { ClientReplacementProgramForm } from "./client-replacement-program.type";

/**
 * Client form state for multi-step form
 */
export type ClientFormState = {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  notes?: string;

  // Step 2: Behaviors
  behaviors: ClientBehaviorForm[];

  // Step 3: Replacement Programs
  replacementPrograms: ClientReplacementProgramForm[];

  // Step 4: Interventions
  interventions: ClientInterventionForm[];

  // Form progression
  currentStep: number;
  isComplete: boolean;
};

/**
 * Client form complete submission for API
 */
export type ClientFormSubmission = {
  // Client basic info
  client: {
    firstName: string;
    lastName: string;
    gender: string;
    notes?: string;
    organizationId: string;
  };

  // Client behaviors
  behaviors: {
    behaviorName: string;
    behaviorDescription?: string | null;
    baseline: number;
    type: "frequency" | "percentage";
    topographies?: string[] | null;
  }[];

  // Client replacement programs with behavior indices
  replacementPrograms: {
    programName: string;
    programDescription?: string | null;
    baseline: number;
    behaviorIndices: number[]; // Indices of behaviors from the behaviors array
  }[];

  // Client interventions with behavior indices
  interventions: {
    interventionName: string;
    interventionDescription?: string | null;
    behaviorIndices: number[]; // Indices of behaviors from the behaviors array
  }[];
};
