import { GenreResponse } from '#core/infra/db/repository/interfaces/genre-repository'

export abstract class IGenreService {
  abstract findAll(): Promise<GenreResponse[]>
}
