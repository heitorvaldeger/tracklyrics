import vine from "@vinejs/vine";

const envSchema = vine.compile(
  vine.object({
    VITE_API_URL: vine.string().url({
      host_whitelist: ["localhost"],
    }),
  }),
);

export const env = await envSchema.validate(import.meta.env);
