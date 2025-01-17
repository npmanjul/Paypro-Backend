const validationMiddleware = (schema) => async (req, res, next) => {
    try {
      const data = await schema.parseAsync(req.body);
      req.body = data;
      next();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const validationErrors = err.errors.map((error) => ({
          field: error.path.join('.'),
          message: error.message,
        }));
  
        return res.status(422).json({
          statusCode: 422,
          message: "Validation error",
          errors: validationErrors[0],
        });
      }
  
      next(err);
    }
  };
  
  export default validationMiddleware;