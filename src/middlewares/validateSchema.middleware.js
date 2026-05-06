const validateSchema = (schema) => {

    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        // Validar
        if (!result.success) {
            const errors = result.error.issues.map((issue) => {
                return {
                    field: issue.path[0],
                    message : issue.message
                }
            })
            return res.status(400).json(errors);
        }
        // Esta todo OK
        req.body = result.data;
        next();
    }
};

module.exports = validateSchema;