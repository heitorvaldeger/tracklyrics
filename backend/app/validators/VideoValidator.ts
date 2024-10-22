import vine from '@vinejs/vine'

export const createVideoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    artist: vine.string().trim().minLength(3),
    isDraft: vine.boolean().optional(),
    releaseYear: vine
      .string()
      .trim()
      .fixedLength(4)
      .regex(/^[0-9]+$/),
    linkYoutube: vine.string().trim().minLength(3),
    languageId: vine.number().transform((value) => BigInt(value)),
  })
)
