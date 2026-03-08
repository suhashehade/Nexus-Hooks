export const validate = (schema, type = "body") => (req, res, next) => {
    const data = req[type];
    const result = schema.safeParse(data);
    if (!result.success)
        throw result.error;
    req[type] = result.data;
    next();
};
