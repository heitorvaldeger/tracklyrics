import { LanguageFindModel } from '#models/language-model/language-find-model'

export abstract class LanguageRepository {
  abstract findAll(): Promise<LanguageFindModel[]>
  abstract findById(id: number): Promise<LanguageFindModel | null>
}
