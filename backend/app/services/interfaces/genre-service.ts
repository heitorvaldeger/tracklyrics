import { GenreResponse } from '#infra/db/repository/interfaces/genre-repository'

export abstract class IGenreService {
  abstract findAll(): Promise<GenreResponse[]>
}
