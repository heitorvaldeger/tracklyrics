import { MethodResponse } from '#helpers/types/method-response'
import { Genre } from '#models/genre'

export abstract class GenreProtocolService {
  abstract findAll(): Promise<MethodResponse<Genre[]>>
}
