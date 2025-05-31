import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export abstract class IRegisterSchema
  implements
    IValidatorSchema<{
      email: string
      password: string
      username: string
      firstName: string
      lastName: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    email: string
    password: string
    username: string
    firstName: string
    lastName: string
  }>
}
