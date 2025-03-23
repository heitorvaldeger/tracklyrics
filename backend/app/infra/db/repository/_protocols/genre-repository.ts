import { Genre } from '#models/genre'

export abstract class GenreRepository {
  abstract findAll(): Promise<Genre[]>
  abstract findById(id: number): Promise<Genre | null>
}
