import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { IVideoResponse } from '#interfaces/IVideoResponse'

export abstract class IVideoService {
  abstract findAll(): Promise<IVideoResponse[]>
  abstract find(uuid: string): Promise<IMethodResponse<IVideoResponse | null>>
  abstract findByGenrer(genrerId: number): Promise<IMethodResponse<IVideoResponse[]>>
  abstract findByLanguage(languageId: number): Promise<IVideoResponse[]>
  abstract delete(uuid: string): Promise<IMethodResponse<any>>
}
