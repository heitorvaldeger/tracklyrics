import vine from '@vinejs/vine'

export const updatePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().trim().minLength(6),
  })
)

export const validateUpdatePasswordValidator = vine.compile(
  vine.object({
    codeOTP: vine.string().trim().fixedLength(6),
  })
)
