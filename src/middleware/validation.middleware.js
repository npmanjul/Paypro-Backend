const validationMiddleware = (schema) => async (req, res, next) => {
    try {
        const data = await schema.parseAsync(req.body);
        req.body = data;
        next();
    }
    catch (err) {
        const extraDetails = err.errors[0].message;
        const message = "Fill this input properly";
        const statusCode = 422;

        const error = {
            statusCode,
            message,
            extraDetails
        }
        next(error);
    }
}

export default validationMiddleware;