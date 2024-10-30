import vine from '@vinejs/vine'

export const genrerIdVideoValidator = vine.compile(
  vine.object({
    genrerId: vine.number().positive(),
  })
)
