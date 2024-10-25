import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IFindAllRepository } from './IFindAllRepository.js'

export abstract class IVideoRepository extends IFindAllRepository {
  abstract find(uuid: string): Promise<IVideoResponse | null>
  abstract findByGenrer(genrerId: number): Promise<IVideoResponse | null>
}
