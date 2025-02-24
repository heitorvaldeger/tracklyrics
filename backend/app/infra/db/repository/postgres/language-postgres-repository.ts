import db from '@adonisjs/lucid/services/db'

import { toCamelCase } from '#helpers/to-camel-case'
import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { LanguageFindModel } from '#models/language-model/language-find-model'

export class LanguagePostgresRepository implements LanguageRepository {
  async findAll() {
    const languages: LanguageFindModel[] = await db
      .from('languages')
      .select(['id', 'name', 'flag_country'])

    return languages.map((language) => toCamelCase(language))
  }

  async findById(languageId: number) {
    const language = await db
      .from('languages')
      .where('id', languageId)
      .select(['id', 'name', 'flag_country'])
      .first()

    return (language && toCamelCase(language)) as LanguageFindModel | null
  }
}
