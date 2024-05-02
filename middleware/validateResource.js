import { validaterequest } from '../utils/validation';

const validateResource =
  (schema, abortEarly = false) =>
  async (req, _, next) => {
    await validaterequest(schema, { body: req.body, params: req.params, query: req.query }, abortEarly);
    next();
  };

export default validateResource;
