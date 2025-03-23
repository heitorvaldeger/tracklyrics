import { Genre } from '#models/genre'

export abstract class GenreProtocolService {
  abstract findAll(): Promise<Genre[]>
}
