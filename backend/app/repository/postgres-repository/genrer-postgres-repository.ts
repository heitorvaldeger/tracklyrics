import db from '@adonisjs/lucid/services/db'
import { GenrerFindModel } from '#models/genrer-model/genrer-find-model'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

export class GenrerPostgresRepository implements IFindAllRepository<GenrerFindModel> {
  async findAll(): Promise<GenrerFindModel[]> {
    const genrers: GenrerFindModel[] = await db.from('genrers').select(['id', 'name'])
    return genrers
  }
}
