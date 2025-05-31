import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export abstract class ISignInSchema
  implements
    IValidatorSchema<{
      email: string
      password: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    email: string
    password: string
  }>
}
