import {
  ILanguageRepository,
  LanguageResponse,
} from '#core/infra/db/repository/interfaces/language-repository'
import { Language } from '#models/language'

export class LanguagePostgresRepository implements ILanguageRepository {
  async findAll() {
    return (await Language.query().orderBy('id').select()).map(
      (language) => language.serialize() as LanguageResponse
    )
  }

  async findById(languageId: number) {
    return (await Language.findBy('id', languageId))?.serialize() as LanguageResponse
  }
}
