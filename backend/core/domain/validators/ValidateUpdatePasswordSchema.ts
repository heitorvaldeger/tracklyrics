import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export abstract class IValidateUpdatePasswordSchema
  implements
    IValidatorSchema<{
      codeOTP: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    codeOTP: string
  }>
}
