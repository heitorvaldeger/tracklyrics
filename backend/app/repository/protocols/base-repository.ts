import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { LanguageFindModel } from '#models/language-model/language-find-model'

export abstract class BaseRepository<T> {
  abstract findAll(): Promise<T[]>
  abstract findById(id: number): Promise<T | null>
}

export abstract class LanguageRepository extends BaseRepository<LanguageFindModel> {
  abstract findAll(): Promise<LanguageFindModel[]>
  abstract findById(id: number): Promise<LanguageFindModel | null>
}

export abstract class GenreRepository extends BaseRepository<GenreFindModel> {
  abstract findAll(): Promise<GenreFindModel[]>
  abstract findById(id: number): Promise<GenreFindModel | null>
}
