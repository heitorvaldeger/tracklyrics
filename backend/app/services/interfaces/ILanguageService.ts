import { LanguageFindModel } from '#models/language/language-find-model'

export abstract class ILanguageService {
  abstract findAll(): Promise<LanguageFindModel[]>
}
