// First asyncHandler implementation using Promises
const asyncHandler = (requestHandler) => {
    // Return a new function that acts as the route handler
    return (req, res, next) => {
        // Resolve the Promise returned by the requestHandler
        // and catch any errors, passing them to the next middleware
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // Pass any error to the Express error handler
    };
};

// Export the asyncHandler for use in other parts of the application
export { asyncHandler };


// // Second asyncHandler implementation using async/await
// const asyncHandler = (fn) => 
//     // Return an async function that acts as the route handler
//     async (req, res, next) => {
//         try {
//             // Await the execution of the passed-in function (fn)
//             await fn(req, res, next);
//         } catch (error) {
//             // If an error occurs, send a response with an error status
//             res.status(error.code || 500).json({
//                 success: false, // Indicate failure in the response
//             });
//         }
//     };


