type Code =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR"
  | "UNEXPECTED_ERROR";

export default class ApiError extends Error {
  readonly code: Code;
  readonly cause: unknown;

  private constructor(message: string, code: Code, cause: unknown = null) {
    super(message, { cause });
    this.name = new.target.name;
    this.code = code;
    this.cause = cause;
  }

  static notFound(
    message = "Resource not found",
    cause: unknown = null
  ): ApiError {
    return new ApiError(message, "NOT_FOUND", cause);
  }

  static validationError(
    message = "Validation error",
    cause: unknown = null
  ): ApiError {
    return new ApiError(message, "VALIDATION_ERROR", cause);
  }

  static internalError(
    message = "Internal server error",
    cause: unknown = null
  ): ApiError {
    return new ApiError(message, "INTERNAL_ERROR", cause);
  }

  static unexpectedError(
    message = "Unexpected error occurred",
    cause: unknown = null
  ): ApiError {
    return new ApiError(message, "UNEXPECTED_ERROR", cause);
  }
}