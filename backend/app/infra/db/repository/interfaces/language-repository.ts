import { Language } from '#models/language'

export abstract class ILanguageRepository {
  abstract findAll(): Promise<Language[]>
  abstract findById(id: number): Promise<Language | null>
}
