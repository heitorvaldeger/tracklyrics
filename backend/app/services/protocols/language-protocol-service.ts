import { LanguageFindModel } from '#models/language-model/language-find-model'

export abstract class LanguageProtocolService {
  abstract findAll(): Promise<LanguageFindModel[]>
}
