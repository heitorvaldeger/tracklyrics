import {
  GenreResponse,
  IGenreRepository,
} from '#core/infra/db/repository/interfaces/genre-repository'
import { Genre } from '#models/genre'

export class GenrePostgresRepository implements IGenreRepository {
  async findAll() {
    return (await Genre.query().orderBy('id').select()).map(
      (genre) => genre.serialize() as GenreResponse
    )
  }

  async findById(genreId: number) {
    return (await Genre.findBy('id', genreId))?.serialize() as GenreResponse
  }
}
