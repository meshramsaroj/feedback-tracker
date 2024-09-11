import {z} from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 character")
  .max(20, "Username must not more than 20 character")
  .regex(/^[A-Za-z0-9_]+$/, "Username must not content special character");

  export const SignUpSchema = z.object({
    username: usernameValidation,
    password: z.string().min(6, "Password must be at least 6 character"),
    email: z.string().email({message: "Invalid email address"})
  })
