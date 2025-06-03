import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export abstract class IUpdatePasswordSchema
  implements
    IValidatorSchema<{
      password: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    password: string
  }>
}
