import db from '@adonisjs/lucid/services/db'
import { LanguageRepository } from '#repository/protocols/base-repository'
import { LanguageFindModel } from '#models/language-model/language-find-model'

export class LanguagePostgresRepository implements LanguageRepository {
  async findAll() {
    const languages: LanguageFindModel[] = await db.from('languages').select(['id', 'name'])
    return languages
  }
}
