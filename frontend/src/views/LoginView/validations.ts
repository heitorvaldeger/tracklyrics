import * as zod from "zod";

export const signInValidationSchema = zod.object({
  email: zod.string().nonempty("Must contain at least 1 character(s)"),
  password: zod.string().nonempty("Must contain at least 1 character(s)")
});