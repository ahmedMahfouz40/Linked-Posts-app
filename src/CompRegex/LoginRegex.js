import * as z from "zod";

export const scheme = z.object({
  email: z.email("Email is required."),
  password: z
    .string("Password is required.")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character.",
    ),
});
