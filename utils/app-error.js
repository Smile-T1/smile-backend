/**
 * The appError class represents an error that occurs in the application.
 * It extends the built-in Error class and adds additional properties for status code, status, and operational flag.
 *
 * @class
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @property {number} statusCode - The HTTP status code associated with the error.
 * @property {string} status - The status of the error, either 'fail' or 'error' based on the statusCode.
 * @property {boolean} isOperational - Indicates whether the error is operational or not.
 */
class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Operational means conceptual errors like a typo from user input

    Error.captureStackTrace(this, this.constructor); // Don't pollute the stack trace with this function
  }
}

export default appError;
