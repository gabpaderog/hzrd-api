export class AppError extends Error {
   public statusCode: number;
   public isOperational: boolean;

   constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
   }
}

export class BadRequestError extends AppError {
   constructor(message: string = "Bad Request") {
      super(message, 400);
   }
}

export class NotFoundError extends AppError {
   constructor(message: string = "Not Found") {
      super(message, 404);
   }
}

export class InternalServerError extends AppError {
   constructor(message: string = "Internal Server Error") {
      super(message, 500);
   }
}

export class ServiceUnavailableError extends AppError {
   constructor(message: string = "Service Unavailable") {
      super(message, 503);
   }
}

export class RateLimitError extends AppError {
   constructor(message: string = "Too Many Requests") {
      super(message, 429);
   }
}