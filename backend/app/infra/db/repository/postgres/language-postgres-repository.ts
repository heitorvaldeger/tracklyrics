import db from '@adonisjs/lucid/services/db'

import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { Language } from '#models/language'
import { toCamelCase } from '#utils/index'

export class LanguagePostgresRepository implements LanguageRepository {
  async findAll() {
    const languages: Language[] = await db.from('languages').select(['id', 'name', 'flag_country'])

    return languages.map((language) => toCamelCase(language))
  }

  async findById(languageId: number) {
    const language: Language | null = await db
      .from('languages')
      .where('id', languageId)
      .select(['id', 'name', 'flag_country'])
      .first()

    return language && toCamelCase<Language>(language)
  }
}
