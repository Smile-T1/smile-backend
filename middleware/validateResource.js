import { validaterequest } from '../utils/validation.js';

const validateResource =
  (schema, abortEarly = false) =>
  async (req, res, next) => {
    try {
      await validaterequest(schema, { body: req.body, params: req.params, query: req.query }, abortEarly);
      next();
    } catch (error) {
      console.error('Error validating request:', error);
      return res.status(400).json({ msg: error.errors });
    }
  };

export default validateResource;
