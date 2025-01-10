import { GenreFindModel } from '#models/genre-model/genre-find-model'

export abstract class GenreRepository {
  abstract findAll(): Promise<GenreFindModel[]>
  abstract findById(id: number): Promise<GenreFindModel | null>
}
