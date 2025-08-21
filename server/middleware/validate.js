export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    const issues = Array.isArray(error?.errors) ? error.errors : (Array.isArray(error?.issues) ? error.issues : []);
    const message = issues[0]?.message || error?.message || "Validation failed";
    res.status(422).json({ message });
  }
}


