import { NextResponse } from "next/server";
import {
  ApiDataResponse,
  ApiError,
  ApiListResponse,
  ApiStatusResponse,
  ErrorCode,
  ERROR_STATUS_MAP,
  PaginationMeta,
  ApiResponse,
} from "@praxisnotes/types";

/**
 * Create a success response with data
 * @param data Response data
 * @param meta Additional metadata
 * @returns NextResponse with standardized format
 */
export function createSuccessResponse<T>(
  data: T,
  pagination?: Record<string, unknown>,
): NextResponse<ApiDataResponse<T>> {
  return NextResponse.json({
    data,
    pagination: pagination ?? {},
  });
}

/**
 * Create a success response for lists with pagination
 * @param data Array of data items
 * @param pagination Pagination data
 * @returns NextResponse with standardized format
 */
export function createListResponse<T>(
  data: T[],
  pagination: PaginationMeta,
): NextResponse<ApiListResponse<T>> {
  return NextResponse.json({
    data,
    pagination,
  });
}

/**
 * Create a status response
 * @param success Whether the operation was successful
 * @param message Optional message
 * @returns NextResponse with standardized format
 */
export function createStatusResponse(
  success: boolean,
  message?: string,
): NextResponse<ApiStatusResponse> {
  return NextResponse.json({
    success,
    message: message ?? "",
  });
}

/**
 * Create an error response
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @returns NextResponse with error and appropriate status
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
): NextResponse<ApiDataResponse<never>> {
  const error: ApiError = {
    code,
    message: message ?? "",
    details: details ?? {},
  };

  return NextResponse.json({ error }, { status: ERROR_STATUS_MAP[code] });
}

/**
 * Create a not found error response
 * @param message Error message
 * @returns NextResponse with 404 status
 */
export function createNotFoundResponse(
  message = "Resource not found",
): NextResponse {
  return createErrorResponse(ErrorCode.NOT_FOUND, message);
}

/**
 * Create a validation error response
 * @param message Error message
 * @param details Validation error details
 * @returns NextResponse with 422 status
 */
export function createValidationErrorResponse(
  message = "Validation failed",
  details?: Record<string, unknown>,
): NextResponse {
  return createErrorResponse(ErrorCode.VALIDATION_ERROR, message, details);
}

/**
 * Create a server error response
 * @param message Error message
 * @returns NextResponse with 500 status
 */
export function createServerErrorResponse(
  message = "Internal server error",
): NextResponse {
  return createErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, message);
}

/**
 * Create an unauthorized error response
 * @param message Error message
 * @returns NextResponse with 401 status
 */
export function createUnauthorizedResponse(
  message = "Unauthorized",
): NextResponse {
  return createErrorResponse(ErrorCode.UNAUTHORIZED, message);
}

/**
 * Create a forbidden error response
 * @param message Error message
 * @returns NextResponse with 403 status
 */
export function createForbiddenResponse(message = "Forbidden"): NextResponse {
  return createErrorResponse(ErrorCode.FORBIDDEN, message);
}

/**
 * Create a successful API response
 * @param data The data to include in the response
 * @param options Additional response options
 * @returns NextResponse with data and status 200
 */
export function createApiResponse<T>(
  data: T,
  options?: {
    status?: number;
    pagination?: ApiResponse<T>["pagination"];
  },
): NextResponse {
  const response = {
    data,
    pagination: options?.pagination,
  };

  return NextResponse.json(response, { status: options?.status || 200 });
}
