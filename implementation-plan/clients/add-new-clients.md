# Client Management Implementation Plan

## Overview

This document outlines the implementation plan for adding new clients to the PraxisNotes application through a multi-step form. The form will collect client basic information, behaviors, replacement programs, and interventions.

## Database Schema Updates

Instead of using traditional foreign key relationships for all entities, we'll use a hybrid approach:

- Client references will use foreign keys to maintain data integrity
- Behavior, replacement program, and intervention data will be embedded directly in the relation tables

### New Tables

#### 1. `client_behaviors`

```sql
CREATE TABLE client_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Embedded behavior data instead of FK
  behavior_name VARCHAR(255) NOT NULL,
  behavior_description TEXT,

  -- Additional fields
  baseline NUMERIC NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('frequency', 'percentage')),
  topographies JSONB,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### 2. `client_replacement_programs`

```sql
CREATE TABLE client_replacement_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Embedded replacement program data instead of FK
  program_name VARCHAR(255) NOT NULL,
  program_description TEXT,

  -- Additional fields
  baseline NUMERIC NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### 3. `client_replacement_program_behaviors`

```sql
CREATE TABLE client_replacement_program_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_replacement_program_id UUID NOT NULL REFERENCES client_replacement_programs(id) ON DELETE CASCADE,
  client_behavior_id UUID NOT NULL REFERENCES client_behaviors(id) ON DELETE CASCADE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### 4. `client_interventions`

```sql
CREATE TABLE client_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Embedded intervention data instead of FK
  intervention_name VARCHAR(255) NOT NULL,
  intervention_description TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### 5. `client_intervention_behaviors`

```sql
CREATE TABLE client_intervention_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_intervention_id UUID NOT NULL REFERENCES client_interventions(id) ON DELETE CASCADE,
  client_behavior_id UUID NOT NULL REFERENCES client_behaviors(id) ON DELETE CASCADE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## TypeScript Types

### 1. Client Behavior

```typescript
// Client Behavior Types
export type ClientBehavior = {
  id: string;
  clientId: string;

  // Embedded behavior data
  behaviorName: string;
  behaviorDescription: string | null;

  // Additional fields
  baseline: number;
  type: "frequency" | "percentage";
  topographies: string[];

  createdAt: Date;
  updatedAt: Date;
};

export type NewClientBehavior = Omit<
  ClientBehavior,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
```

### 2. Client Replacement Program

```typescript
// Client Replacement Program Types
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

export type NewClientReplacementProgram = Omit<
  ClientReplacementProgram,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // For creation only - will be used to create relationships
  behaviorIds: string[];
};
```

### 3. Client Intervention

```typescript
// Client Intervention Types
export type ClientIntervention = {
  id: string;
  clientId: string;

  // Embedded intervention data
  interventionName: string;
  interventionDescription: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type NewClientIntervention = Omit<
  ClientIntervention,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // For creation only - will be used to create relationships
  behaviorIds: string[];
};
```

## Multi-Step Form Implementation

### Step 1: Basic Client Information

- First Name (required)
- Last Name (required)
- Gender (required, select dropdown)
- Notes (optional)

### Step 2: Client Behaviors

For each behavior:

- Name (searchable dropdown with create option)
- Description (auto-populated from selection, editable)
- Baseline (numerical input)
- Type (dropdown: 'frequency' or 'percentage')
- Topographies (dynamic list of text inputs)

Users can add multiple behaviors.

### Step 3: Replacement Programs

For each replacement program:

- Name (searchable dropdown with create option)
- Description (auto-populated from selection, editable)
- Baseline (numerical input)
- Associated Behaviors (multi-select from behaviors added in Step 2)

Users can add multiple replacement programs.

### Step 4: Interventions

For each intervention:

- Name (searchable dropdown with create option)
- Description (auto-populated from selection, editable)
- Associated Behaviors (multi-select from behaviors added in Step 2)

Users can add multiple interventions.

## API Routes

### 1. Create Client with All Related Data

**Endpoint:** `POST /api/clients`

This endpoint will handle creating:

1. The client record
2. All client behaviors
3. All client replacement programs and their behavior associations
4. All client interventions and their behavior associations

## Conclusion

This implementation plan provides a detailed roadmap for building a multi-step form to add clients with associated behavioral data. By embedding data directly in relation tables rather than using foreign keys for all entities, we achieve more flexibility while maintaining the connection to the client.
