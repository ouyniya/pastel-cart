const { z, ZodError } = require("zod");
const createError = require("../utils/create-error");

exports.registerSchema = z
  .object({
    email: z.email("Invalid email"),
    name: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

exports.loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

exports.categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
});

exports.validationZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      let issues = [];

      try {
        issues = JSON.parse(error.message);
      } catch (error) {
        issues = [];
      }

      const formattedErrors = issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    // fallback
    res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: [],
    });
  }
};
