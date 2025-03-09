import db from '@adonisjs/lucid/services/db'

import { Genre } from '#models/genre'

import { GenreRepository } from '../_protocols/genre-repository.js'

export class GenrePostgresRepository implements GenreRepository {
  async findAll(): Promise<Genre[]> {
    const genres: Genre[] = await db.from('genres').select(['id', 'name'])
    return genres
  }

  async findById(genreId: number) {
    const language: Genre | null = await db
      .from('genres')
      .where('id', genreId)
      .select(['id', 'name'])
      .first()
    return language
  }
}
