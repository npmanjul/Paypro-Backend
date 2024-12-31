import { z } from 'zod';

const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be 100 characters or fewer" }),
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one digit" })
        .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" }),
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, { message: "Phone number must be a valid 10-digit number" }),
});

const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one digit" })
        .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" }),
});

export { signupSchema, loginSchema };