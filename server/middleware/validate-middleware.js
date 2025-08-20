import { registerSchema, loginSchema } from "../validators/auth-validators.js";

const validateRegister = (schema) => async (req, res, next) => {
    try {
        const parsedData = await schema.parseAsync(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        const issues = Array.isArray(error?.errors) ? error.errors : (Array.isArray(error?.issues) ? error.issues : []);
        const message = issues[0]?.message || error?.message || "Validation failed";
        res.status(422).json({ message });
    }
}

const validateLogin = (schema) => async (req, res, next) => {
    try {
        const parsedData = await schema.parseAsync(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        const issues = Array.isArray(error?.errors) ? error.errors : (Array.isArray(error?.issues) ? error.issues : []);
        const message = issues[0]?.message || error?.message || "Validation failed";
        res.status(422).json({ message });
    }
}

export { validateRegister, validateLogin, registerSchema, loginSchema };