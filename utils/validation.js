import appError from './app-error.js';

export async function validaterequest(schema, fields, abortEarly = false) {
  try {
    return schema.validate(fields, { abortEarly });
  } catch (error) {
    //return error in case of validation error in response json
    console.error('Error validating request:', error);
    throw new appError('Validation error', 400);
  }
}
