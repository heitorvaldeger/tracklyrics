import { Language } from '#models/language'

export abstract class ILanguageService {
  abstract findAll(): Promise<Language[]>
}
