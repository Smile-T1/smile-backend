import appError from './app-error.js';

export async function validaterequest(schema, fields, abortEarly = false) {
  try {
    return schema.validate(fields, { abortEarly });
  } catch (error) {
    throw new appError('Request Validation failed', 400);
  }
}
