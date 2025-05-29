import { IValidatorSchema } from '#validators/interfaces/ValidatorSchema'

export abstract class IValidateEmailSchema
  implements
    IValidatorSchema<{
      email: string
      codeOTP: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    email: string
    codeOTP: string
  }>
}
