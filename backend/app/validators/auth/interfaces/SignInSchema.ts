import ValidationException from '#exceptions/ValidationException'

export abstract class ISignInSchema {
  abstract validateAsync(data: any): Promise<{
    email: string
    password: string
  }>
}
