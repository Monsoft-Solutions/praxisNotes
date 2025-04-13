# Session Notes Generation Feature Implementation Plan

## Overview

This implementation plan outlines the tasks required to build the session notes generation feature for PraxisNotes. The feature will allow users to create, view, and manage session notes for client therapy sessions, with AI-assisted note generation.

## User Flow

1. User navigates to a client's profile
2. User creates a new session note
3. User fills in session data (date, time, location, etc.)
4. User adds multiple ABC (Antecedent, Behavior, Consequence) data entries
5. User submits the session data
6. AI generates formatted session notes
7. User reviews, edits, and finalizes the notes
8. User saves or exports the final notes

## Tech Stack Components

- **Frontend**: React, Next.js, Shadcn UI
- **Backend**: Next.js API routes
- **Database**: PostgreSQL via Drizzle ORM
- **AI Integration**: AI SDK with Anthropic Claude
- **State Management**: SWR for data fetching, React Hook Form for forms

## Implementation Tasks

### 1. Database Schema Implementation

**Task 1.1: Create Session Table Schema**

- Create `session.table.ts` in the database package
- Define session schema with fields:
  - id (UUID)
  - clientId (foreign key to clients)
  - userId (foreign key to users)
  - sessionDate (date)
  - startTime (time)
  - endTime (time)
  - location (string)
  - presentParticipants (string)
  - environmentalChanges (json) - array of env changes
  - reinforcers (json) - array of reinforcers
  - valuation (enum: fair, good, poor)
  - status (enum: draft, submitted, reviewed)
  - createdAt (timestamp)
  - updatedAt (timestamp)

**Task 1.2: Create ABC Schema Table**

- Create `session-abc.table.ts` for storing complete ABC data:
  - id (UUID)
  - sessionId (foreign key to sessions)
  - sequenceNumber (integer) - for ordering multiple ABCs
  - activityAntecedent (text)
  - behaviorNames (json) - array of behavior names selected
  - interventionNames (json) - array of intervention names selected
  - replacementProgramNames (json) - array of replacement program names selected
  - createdAt (timestamp)
  - updatedAt (timestamp)

**Task 1.3: Create Session Notes Table**

- Create `session-note.table.ts`:
  - id (UUID)
  - sessionId (foreign key to sessions)
  - generatedContent (text)
  - finalContent (text)
  - isGenerated (boolean)
  - status (enum: draft, finalized)
  - createdAt (timestamp)
  - updatedAt (timestamp)

**Task 1.4: Update Database Migrations**

- Run `cd packages/databae && pnpm generate` to generate migration files

### 2. Backend API Implementation

**Task 2.1: Create Session API Route**

- Create `app/api/clients/[clientId]/sessions/route.ts`
- Implement GET, POST handlers for sessions
- When creating the session, it will save all the needed data in DB,
  and will create the session notes using ai-sdk
- Follow this instructions https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#language-models
- Design effective prompt templates for note generation
- Include section for formatting instructions

**Task 2.2: Create Session Detail API Route**

- Create `app/api/clients/[clientId]/sessions/[sessionId]/route.ts`
- Implement GET, PUT, DELETE handlers

### 3. AI Integration

### 4. Frontend Implementation

**Task 4.1: Create Session Form Components**

- Implement form for session basic details (date, time, location)
- Create dynamic ABC data entry components with add/remove functionality
- Build selection interfaces with direct text value storage
- Implement reinforcers and environmental changes input fields
- Add valuation radio button component (Fair/Good/Poor)

**Task 4.2: Implement Session Notes Page**

- Create `app/clients/[clientId]/sessions/[sessionId]/page.tsx`
- Implement UI for viewing and editing session notes

**Task 4.3: Create Notes Generation Interface**

- Design UI for AI note generation process
- Implement streaming UI with loading states

**Task 4.4: Implement Notes Editing Interface**

- Create rich text editor for editing generated notes
- Add validation and error handling

**Task 4.5: Implement Session List View**

- Create page to list all sessions for a client
- Add filtering and sorting options

**Task 4.6: Implement ABC Management Interface**

- Create interface for viewing and managing multiple ABC entries
- Add UI for reordering ABC sequences
- Implement ABC cards with editable fields

### 5. Data Fetching and State Management

**Task 5.1: Create SWR Hooks for Sessions**

- Implement `useSession` and `useSessions` hooks
- Add data fetching and caching logic
- Support efficient handling of multiple ABC entries

**Task 5.2: Create Form State Management**

- Set up React Hook Form for session data
- Implement form validation with Zod
- Add support for dynamic form arrays for multiple ABC entries

**Task 5.3: Implement Real-time UI Updates**

- Set up SWR mutations for optimistic updates
- Implement proper error handling and recovery

**Task 5.4: Create Chat Context for AI Interaction**

- Implement `useChat` hook from AI SDK for UI
- Configure streaming and response handling

## Dependencies

- AI SDK (@ai-sdk/anthropic)
- AI SDK UI (useChat)
- React Hook Form
- SWR
- Zod for validation
- Drizzle ORM
