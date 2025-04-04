export interface LanguageResponse {
  id: number
  name: string
  flagCountry?: string
}

export abstract class ILanguageRepository {
  abstract findAll(): Promise<LanguageResponse[]>
  abstract findById(id: number): Promise<LanguageResponse | null>
}
