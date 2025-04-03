# API Route Validation Guide

This guide explains how to implement validation for API routes in the PraxisNotes application.

## Structure

Each API route should have its own validation file that defines the validation schemas for different HTTP methods:

```
apps/web/app/api/
├── {resource}/
│   ├── route.ts         # API route handler
│   └── validation.ts    # Validation schemas for this route
```

## Common Validation Schemas

Common validation schemas are in `apps/web/lib/validations/common.ts`:

- `paginationSchema`: Reusable pagination parameters (page, limit)
- `uuidSchema`: UUID validation for IDs

## Implementing Route Validation

1. Create a validation file for your route in the same directory:

```typescript
// apps/web/app/api/{resource}/validation.ts
import { z } from "zod";
import { paginationSchema, uuidSchema } from "@/lib/validations/common";

export const getResourceQuerySchema = z
  .object({
    id: uuidSchema.optional(),
    // Add other parameters specific to this resource
  })
  .merge(paginationSchema);

export type GetResourceQueryParams = z.infer<typeof getResourceQuerySchema>;

// For POST requests
export const createResourceSchema = z.object({
  // Define the shape of your resource creation payload
});

export type CreateResourcePayload = z.infer<typeof createResourceSchema>;
```

2. Use the validation in your route handler:

```typescript
// apps/web/app/api/{resource}/route.ts
import { NextRequest } from "next/server";
import { validateQuery, validateBody } from "@/lib/api/validation";
import { getResourceQuerySchema, createResourceSchema } from "./validation";

export async function GET(request: NextRequest) {
  // Validate query parameters
  const queryValidation = await validateQuery(request, getResourceQuerySchema);
  if (!queryValidation.success) {
    return queryValidation.response;
  }

  const { id, page, limit } = queryValidation.data;
  // Process the request with validated parameters
}

export async function POST(request: NextRequest) {
  // Validate request body
  const bodyValidation = await validateBody(request, createResourceSchema);
  if (!bodyValidation.success) {
    return bodyValidation.response;
  }

  const data = bodyValidation.data;
  // Process the request with validated body
}
```

## Best Practices

1. Always define a validation schema for each HTTP method in your API route
2. Reuse common schemas like `paginationSchema` for consistency
3. Export types derived from your schemas for use in your route handlers
4. Use descriptive error messages in your schemas
5. Keep validation logic separate from business logic
6. Use refinements for complex validation rules
7. Define schemas for both query parameters and request bodies
