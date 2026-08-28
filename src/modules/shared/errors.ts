/**
 * Domain-level error types shared across modules. Keeping these separate
 * from framework/HTTP concerns lets server actions and future MCP tools
 * translate them consistently.
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "You are not authenticated.") {
    super(message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "You do not have access to this workspace resource.") {
    super(message, "FORBIDDEN");
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Resource not found.") {
    super(message, "NOT_FOUND");
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly issues: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR");
  }
}
