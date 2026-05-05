/**
 * Base class for application errors.
 * @extends Error
 */
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

/**
 * Error class for when no token is provided or invalid.
 * @message Token is missing or invalid
 * @code 401 Unauthorized
 * @extends AppError
 */
export class NotTokenProvidedOrInvalid extends AppError {
    constructor() {
        super('Token is missing or invalid', 401);
        this.name = 'NotTokenProvidedOrInvalid';
    }
}

/**
 * Error class for validation errors.
 * @code 400 Bad Request
 * @extends AppError
 */
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

/**
 * Error class for unauthorized access.
 * @message Unauthorized
 * @code 401 Unauthorized
 * @extends AppError
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Error class for forbidden access.
 * @message Forbidden
 * @code 403 Forbidden
 * @extends AppError
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

/**
 * Error class for not found errors.
 * @message Resource not found
 * @code 404 Not Found
 * @extends AppError
 */
export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}
