import vine from '@vinejs/vine'

export const languageIdVideoValidator = vine.compile(
  vine.object({
    languageId: vine.number().positive(),
  })
)
