import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const nameRegex = /^[A-Za-z]+$/;

const allowedDomains = ["gmail.com"];

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .refine((val) => val.includes("@"), {
    message: "Email must include @",
  })
  .refine((val) => /\.[A-Za-z]{2,}$/.test(val), {
    message: "Email must include a valid extension (e.g. .com, .in)",
  })
  .refine((val) => {
    const domain = val.split("@")[1];
    return domain && allowedDomains.includes(domain.toLowerCase());
  }, {
    message: `Email domain must be one of: ${allowedDomains.join(", ")}`,
  });

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must not exceed 10 characters")
    .regex(nameRegex, "Name must contain only alphabets"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

