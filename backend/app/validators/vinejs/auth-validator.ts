import vine from '@vinejs/vine'

export const registerAuthValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6).confirmed(),
    username: vine.string().trim().minLength(4),
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
  })
)

export const loginAuthValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
  })
)

export const validateEmailValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    codeOTP: vine.string().trim().fixedLength(6),
  })
)
