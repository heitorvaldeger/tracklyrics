import { IVideoResponse } from '#interfaces/IVideoResponse'

export abstract class IVideoService {
  abstract findAll(): Promise<IVideoResponse[]>
  abstract find(uuid: string): Promise<IVideoResponse | null>
  abstract findByGenrer(genrerId: number): Promise<IVideoResponse[]>
  abstract findByLanguage(languageId: number): Promise<IVideoResponse[]>
}
