import { GenreFindModel } from '#models/genre-model/genre-find-model'

export abstract class GenreProtocolService {
  abstract findAll(): Promise<GenreFindModel[]>
}
