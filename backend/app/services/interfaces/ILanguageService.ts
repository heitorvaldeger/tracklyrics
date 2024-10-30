import { ILanguageResponse } from '#interfaces/ILanguageResponse'

export abstract class ILanguageService {
  abstract findAll(): Promise<ILanguageResponse[]>
}
