import vine from '@vinejs/vine'

const youtubeLinkRegex =
  /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

export const createOrUpdateVideoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    artist: vine.string().trim().minLength(3),
    isDraft: vine.boolean().optional(),
    releaseYear: vine
      .string()
      .trim()
      .fixedLength(4)
      .regex(/^[0-9]+$/),
    linkYoutube: vine.string().regex(youtubeLinkRegex).url(),
    languageId: vine.number(),
    genrerId: vine.number(),
  })
)

export const uuidVideoValidator = vine.compile(
  vine.object({
    uuid: vine.string().trim().uuid(),
  })
)
