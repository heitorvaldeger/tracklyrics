import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export abstract class IUUIDValidatorSchema
  implements
    IValidatorSchema<{
      uuid: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    uuid: string
  }>
}
