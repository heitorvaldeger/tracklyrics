import * as zod from "zod";

export const createNewAccountValidationSchema = zod.object({
  firstName: zod.string().trim().nonempty("Must contain at least 1 character(s)"),
  lastName: zod.string().trim().nonempty("Must contain at least 1 character(s)"),
  username: zod.string().trim().min(4, "Must contain at least 4 character(s)"),
  email: zod.string().email(),
  password: zod.string().trim().min(6, "Must contain at least 6 character(s)"),
  password_confirmation: zod.string().trim().min(6, "Must contain at least 6 character(s)"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"]
});