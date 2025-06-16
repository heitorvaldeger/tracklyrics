import vine from '@vinejs/vine'

export const uuidValidator = vine.compile(
  vine.object({
    uuid: vine.string().trim().uuid(),
  })
)
