import db from '@adonisjs/lucid/services/db'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { ILanguageResponse } from '#interfaces/ILanguageResponse'

export class LanguagePostgresRepository implements IFindAllRepository {
  async findAll(): Promise<ILanguageResponse[]> {
    const languages: ILanguageResponse[] = await db.from('languages').select(['id', 'name'])
    return languages
  }
}
