// Define a custom error class that extends the built-in Error class
class ApiError extends Error {
    // Constructor to initialize the ApiError with specific properties
    constructor(
        statusCode,            // HTTP status code (e.g., 400, 404, 500)
        message = "Something went wrong", // Default error message
        errors = [],           // Array to hold multiple error messages or details
        stack = ""             // Optional stack trace string
    ) {
        // Call the parent class (Error) constructor with the message
        super(message);
        
        // Assign the provided status code to the instance
        this.statusCode = statusCode;

        // Optionally, you can attach additional data (initialized as null)
        this.data = null;

        // Assign the message (this is redundant since `super(message)` does this)
        this.message = message;

        // Indicate that the operation was not successful
        this.success = false;

        // Assign the provided array of errors
        this.errors = errors;

        // Check if a custom stack trace is provided
        if (stack) {
            // If provided, use the custom stack trace
            this.stack = stack;
        } else {
            // Otherwise, capture the stack trace for where this error was created
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the ApiError class so it can be used in other parts of the application
export { ApiError };
