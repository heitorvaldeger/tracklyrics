import { LanguageResponse } from '#infra/db/repository/interfaces/language-repository'

export abstract class ILanguageService {
  abstract findAll(): Promise<LanguageResponse[]>
}
