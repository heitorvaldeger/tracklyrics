import { z, ZodError } from "zod";

export { ZodError };

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

export interface SignInData extends z.infer<typeof SignInValidatorZod> {}
export const SignInValidatorZod = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
});

const YOUTUBE_LINK_REGEX_VALIDATOR =
  /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const TIME_REGEX = /^\d{2}:\d{2}\.\d{2}$/;

const parseTime = (time: string) => {
  const [minutes, seconds, milliseconds] = time.split(/[:.]/).map(Number);
  return minutes * 60000 + seconds * 1000 + milliseconds * 10;
};

export type SaveVideoSchemaValidator = z.infer<typeof SaveVideoValidatorZod>;

export const SaveVideoValidatorZod = z.object({
  title: z.string().trim().min(3),
  artist: z.string().trim().min(3),
  isDraft: z.boolean().optional(),
  releaseYear: z
    .string()
    .trim()
    .length(4)
    .regex(/^[0-9]+$/),
  linkYoutube: z.string().regex(YOUTUBE_LINK_REGEX_VALIDATOR).url(),
  languageId: z.number(),
  genreId: z.number(),
  lyrics: z
    .array(
      z
        .object({
          line: z.string().trim().min(1),
          startTime: z.string().regex(TIME_REGEX, {
            message: "startTime must be in the format MM:SS.ss",
          }),
          endTime: z.string().regex(TIME_REGEX, {
            message: "endTime must be in the format MM:SS.ss",
          }),
        })
        .superRefine((values, ctx) => {
          const startMs = parseTime(values.startTime);
          const endMs = parseTime(values.endTime);

          const isInvalid = startMs > endMs;

          if (isInvalid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `startTime must be less than endTime`,
              path: ["endTime"],
            });
          }
        })
    )
    .optional(),
});
