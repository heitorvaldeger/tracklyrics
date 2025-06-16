import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export abstract class IFindByVideoSchema
  implements
    IValidatorSchema<{
      genreId?: number
      languageId?: number
      userUuid?: string
    }>
{
  abstract validateAsync(data: any): Promise<{
    genreId?: number
    languageId?: number
    userUuid?: string
  }>
}
