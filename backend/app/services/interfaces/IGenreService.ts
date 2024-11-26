import { GenreFindModel } from '#models/genre-model/genre-find-model'

export abstract class IGenreService {
  abstract findAll(): Promise<GenreFindModel[]>
}
