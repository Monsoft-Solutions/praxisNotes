# Session Notes Generation UI/API Implementation Plan

## Overview

This implementation plan focuses on building the UI components and API endpoints required for the session notes generation feature in PraxisNotes. The plan specifically avoids data layer changes and concentrates on creating a seamless user interface for recording session data and generating AI-powered notes.

## User Flow

1. User navigates to a client's profile
2. User creates a new session note
3. User fills in session data (date, time, location, etc.)
4. User adds multiple ABC (Antecedent, Behavior, Consequence) data entries
5. User submits the session data
6. AI generates formatted session notes using Anthropic's Claude model
7. User reviews, edits, and finalizes the notes
8. User saves the final notes

## UI Components

### 1. Session Form Components

**1.1 SessionForm Container**

- Main form container that orchestrates all session data entry
- Manages form state and validation
- Handles submission and API communication

**1.2 SessionHeader**

- Displays client name and session information
- Includes breadcrumb navigation

**1.3 SessionBasicInfo**

- Fields for:
  - Session date (DatePicker)
  - Start/end time (TimePicker)
  - Location (Input)
  - Present participants (Input)
  - Environmental changes (Textarea)

**1.4 ABCCardContainer**

- Container for multiple ABC data entry cards
- Includes "Add ABC" button
- Handles ABC card addition, removal, and reordering

**1.5 ABCCard**

- Individual ABC data entry component with:
  - Activity/Antecedent field (Textarea)
  - Behaviors section (TagInput with remove buttons)
  - Interventions section (TagInput with remove buttons)
  - Replacements Programs section (TagInput with remove buttons)

**1.6 ReinforcersSection**

- Input fields for reinforcers with add/remove functionality

**1.7 ValuationSelector**

- Radio button group for Fair/Good/Poor selection

**1.8 FormActionButtons**

- Save/Draft button
- Generate Notes button
- Cancel button

### 2. Notes Generation Components

**2.1 NotesGenerationContainer**

- Manages AI interaction state
- Displays generation progress and results

**2.2 GenerationLoadingState**

- Shows animated loading indicator during generation
- Displays percentage or progress bar

**2.3 NotesEditor**

- Rich text editor for viewing and editing generated notes
- Includes formatting controls

**2.4 NotesActionButtons**

- Save button
- Export button (PDF, etc.)
- Regenerate button

## API Endpoints

### 1. Session Management Endpoints

**1.1 Create Session API Endpoint**

- **Path**: `/api/client/[clientId]/sessions`
- **Method**: POST
- **Purpose**: Create new session record with form data, Generate session notes using AI
- **Response**: Session ID and metadata, Generated notes content (streaming)

### 2. Notes Generation Endpoint

**2.2 Save Notes API Endpoint**

- **Path**: `/api/client/[clientId]/sessions/[sessionId]/notes`
- **Method**: PUT
- **Purpose**: Save final edited notes
- **Response**: Confirmation of save

## TypeScript Types

### 1. Session Form Types

```typescript
// Base session form type
export type SessionFormData = {
  sessionDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  presentParticipants: string[];
  environmentalChanges: string[];
  abcEntries: ABCEntry[];
  reinforcers: string[];
  valuation: "fair" | "good" | "poor";
};

// ABC Entry type
export type ABCEntry = {
  id: string; // Client-side ID for form handling
  activityAntecedent: string;
  behaviors: string[];
  interventions: string[];
  replacementPrograms: string[];
};
```

```typescript
// Notes generation request
export type NotesGenerationRequest = {
  sessionId: string;
  clientId: string;
  template?: string; // Optional template selection
};

// Notes generation response
export type NotesGenerationResponse = {
  content: string;
  metadata: {
    modelName: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

// Final notes data
export type SessionNotes = {
  id: string;
  sessionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isGenerated: boolean;
};
```

## AI Integration with Anthropic

### 1. AI SDK Integration

- Install required dependencies:

  ```bash
  pnpm add @ai-sdk/anthropic ai
  ```

- Configure environment variables:
  ```
  ANTHROPIC_API_KEY=your_api_key_here
  ```

### 2. AI Notes Generation Service

- Create a service for generating notes using Anthropic:

```typescript
// services/notes-generation.ts
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { SessionFormData } from "@praxisnotes/types";

export async function generateSessionNotes(sessionData: SessionFormData) {
  // Format the session data into a structured prompt
  const prompt = createSessionPrompt(sessionData);

  try {
    const { text, reasoning } = await generateText({
      model: anthropic("claude-3-5-sonnet-20240620"), // or appropriate model
      prompt,
      providerOptions: {
        anthropic: {
          // Optional reasoning configuration if needed
          thinking: { type: "enabled", budgetTokens: 5000 },
        },
      },
    });

    return {
      content: text,
      metadata: {
        reasoning,
        // Other metadata
      },
    };
  } catch (error) {
    console.error("Error generating notes:", error);
    throw error;
  }
}

function createSessionPrompt(sessionData: SessionFormData): string {
  // Create a structured prompt from session data
  return `
    Generate professional and detailed session notes based on the following information:
    
    Date: ${sessionData.sessionDate}
    Time: ${sessionData.startTime} - ${sessionData.endTime}
    Location: ${sessionData.location}
    Participants: ${sessionData.presentParticipants}
    Environmental Changes: ${sessionData.environmentalChanges}
    
    ${sessionData.abcEntries
      .map(
        (abc, index) => `
    ABC Entry #${index + 1}:
    - Activity/Antecedent: ${abc.activityAntecedent}
    - Behaviors: ${abc.behaviors.join(", ")}
    - Interventions: ${abc.interventions.join(", ")}
    - Replacement Programs: ${abc.replacementPrograms.join(", ")}
    `,
      )
      .join("\n")}
    
    Reinforcers: ${sessionData.reinforcers.join(", ")}
    Overall Valuation: ${sessionData.valuation}
    
    Please format the notes in a professional clinical style with proper headings, paragraphs, and bullet points as appropriate.
  `;
}
```

## Development Tasks and Timeline

### Phase 1: UI Components (Week 1)

1. Create SessionForm container and basic components
2. Implement ABC entry components with dynamic add/remove
3. Build form submission logic (without actual API calls)

### Phase 2: API Endpoints (Week 1-2)

1. Create API route stubs for session management
2. Implement notes generation API with Anthropic integration
3. Set up API response types

### Phase 3: Integration (Week 2)

1. Connect UI components to API endpoints
2. Implement notes generation flow
3. Add error handling and loading states
