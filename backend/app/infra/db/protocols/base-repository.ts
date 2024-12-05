import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { LanguageFindModel } from '#models/language-model/language-find-model'

export abstract class LanguageRepository {
  abstract findAll(): Promise<LanguageFindModel[]>
  abstract findById(id: number): Promise<LanguageFindModel | null>
}

export abstract class GenreRepository {
  abstract findAll(): Promise<GenreFindModel[]>
  abstract findById(id: number): Promise<GenreFindModel | null>
}
