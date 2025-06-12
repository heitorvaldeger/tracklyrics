import { z, ZodError as ZE } from "zod";

export const ZodError = ZE;
export interface RegisterData extends z.infer<typeof RegisterValidatorZod> {}

export const RegisterValidatorZod = z
  .object({
    email: z.string().trim().email(),
    password: z.string().trim().min(6),
    confirmPassword: z.string().trim().min(6),
    username: z.string().trim().min(4),
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export interface ValidateEmailData
  extends z.infer<typeof ValidateEmailValidatorZod> {}

export const ValidateEmailValidatorZod = z.object({
  email: z.string().trim().email(),
  codeOTP: z.string().trim().length(6),
});
