import db from '@adonisjs/lucid/services/db'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

export class GenrePostgresRepository implements IFindAllRepository<GenreFindModel> {
  async findAll(): Promise<GenreFindModel[]> {
    const genres: GenreFindModel[] = await db.from('genres').select(['id', 'name'])
    return genres
  }
}
