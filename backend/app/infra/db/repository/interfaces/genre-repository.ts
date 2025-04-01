export interface GenreResponse {
  id: number
  name: string
}

export abstract class IGenreRepository {
  abstract findAll(): Promise<GenreResponse[]>
  abstract findById(id: number): Promise<GenreResponse | null>
}
