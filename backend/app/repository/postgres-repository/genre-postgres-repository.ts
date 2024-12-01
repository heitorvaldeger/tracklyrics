import db from '@adonisjs/lucid/services/db'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { GenreRepository } from '#repository/protocols/base-repository'

export class GenrePostgresRepository implements GenreRepository {
  async findAll(): Promise<GenreFindModel[]> {
    const genres: GenreFindModel[] = await db.from('genres').select(['id', 'name'])
    return genres
  }

  async findById(genreId: number) {
    const language: GenreFindModel | null = await db
      .from('genres')
      .where('id', genreId)
      .select(['id', 'name'])
      .first()
    return language
  }
}
