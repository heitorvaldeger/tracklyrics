import db from '@adonisjs/lucid/services/db'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { LanguageFindModel } from '#models/language-model/language-find-model'

export class LanguagePostgresRepository implements IFindAllRepository {
  async findAll(): Promise<LanguageFindModel[]> {
    const languages: LanguageFindModel[] = await db.from('languages').select(['id', 'name'])
    return languages
  }
}
