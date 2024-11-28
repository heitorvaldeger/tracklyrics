import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { LanguageFindModel } from '#models/language-model/language-find-model'

export abstract class BaseRepository<T> {
  abstract findAll(): Promise<T[]>
}

export abstract class LanguageRepository extends BaseRepository<LanguageFindModel> {
  abstract findAll(): Promise<LanguageFindModel[]>
}

export abstract class GenreRepository extends BaseRepository<GenreFindModel> {
  abstract findAll(): Promise<GenreFindModel[]>
}
