const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const schemaShape = schema?.shape;
            if (schemaShape && (schemaShape.body || schemaShape.query || schemaShape.params || schemaShape.cookies)) {
                await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                    cookies: req.cookies,
                });
            }
            else {
                await schema.parseAsync(req.body);
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
export default validateRequest;
//# sourceMappingURL=validateRequest.js.map