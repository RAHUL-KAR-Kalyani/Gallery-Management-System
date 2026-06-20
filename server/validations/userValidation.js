const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().min(1, "Name is Missing"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["user", "admin"], "Role must be either 'user' or 'admin'"),
});

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["user", "admin"], "Role must be either 'user' or 'admin'"),
});

module.exports = { registerSchema, loginSchema };