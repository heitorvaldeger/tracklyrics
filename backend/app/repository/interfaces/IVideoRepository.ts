import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IFindAllRepository } from './IFindAllRepository.js'

export abstract class IVideoRepository extends IFindAllRepository {
  abstract find(uuid: string): Promise<IVideoResponse | null>
  abstract findByGenrer(genrerId: number): Promise<IVideoResponse[]>
  abstract findByLanguage(languageId: number): Promise<IVideoResponse[]>
  abstract isVideoAvailable(uuid: string): Promise<boolean>
  abstract delete(uuid: string): Promise<void>
}
