export const validator = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body || {});

    if (!result.success) {
        const issues = result.error?.issues || [];

        return res.status(400).json({
            message: "Validation error occurred",
            errors: issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }))
        });
    }

    req.validatedData = result.data;
    next();
};