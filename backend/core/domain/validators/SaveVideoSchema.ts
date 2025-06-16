import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

interface SaveVideoSchemaParams {
  title: string
  artist: string
  isDraft?: boolean
  releaseYear: string
  linkYoutube: string
  languageId: number
  genreId: number
  lyrics?: {
    line: string
    startTime: string
    endTime: string
  }[]
}
export abstract class ISaveVideoSchema implements IValidatorSchema<SaveVideoSchemaParams> {
  abstract validateAsync(data: any): Promise<SaveVideoSchemaParams>
}
