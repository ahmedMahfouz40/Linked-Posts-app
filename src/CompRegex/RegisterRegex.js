import * as z from "zod";

export const scheme = z
  .object({
    name: z
      .string("name is required")
      .nonempty("name is required")
      .min(2, "Name must be at least 2 characters."),
    username: z.string().optional(),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address."),
    dateOfBirth: z
      .string()
      .nonempty("date of birth is required")
      .min(1, "Date of birth is required")
      .refine((value) => {
        const currentYear = new Date().getFullYear();
        const userYear = new Date(value).getFullYear();
        return currentYear - userYear >= 18;
      }, "Age must be 18 or older"),
    gender: z
      .string()
      .nonempty("gender is required")
      .min(1, "Gender is required."),
    password: z
      .string()
      .nonempty("Password is required.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character.",
      ),
    rePassword: z
      .string()
      .nonempty("rePassword is required.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character.",
      ),
  })
  .refine((values) => values.password === values.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });
