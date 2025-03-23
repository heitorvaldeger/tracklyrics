import { Language } from '#models/language'

export abstract class LanguageProtocolService {
  abstract findAll(): Promise<Language[]>
}
