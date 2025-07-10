const { z } = require("zod");

exports.registerSchema = z
  .object({
    email: z.email("Invalid email"),
    name: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
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
  name: z.string().min(3, "Category name must be at least 3 characters")
})

exports.validationZod = (schema) => (req, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.log(error);
    const errMsg = error.errors.map(
      (el) => el.path[0] + ":" + el.message.join(", ")
    );
    const mergedError = new Error(errMsg);
    next(mergedError);
  }
};
