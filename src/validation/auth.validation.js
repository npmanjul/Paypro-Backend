import { z } from "zod";

const signupSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100, { message: "Name must be atleast one character" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .refine(
      (password) =>
        password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&#]/.test(password),
      {
        message:
          "Password must have at least 6 characters, including an uppercase letter, a lowercase letter, a digit, and a special char",
      }
    ),
  phone: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit number",
  }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .refine(
      (password) =>
        password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&#]/.test(password),
      {
        message:
          "Password must have at least 6 characters, including an uppercase letter, a lowercase letter, a digit, and a special char",
      }
    ),
});

export { signupSchema, loginSchema };
