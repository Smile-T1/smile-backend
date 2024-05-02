import appError from './app-error';

export async function validaterequest(schema, fields, abortEarly = false) {
  try {
    return schema.validate(fields, { abortEarly });
  } catch (error) {
    throw new appError(error.message, 400);
  }
}
