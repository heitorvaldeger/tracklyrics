import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'
import { IVideoResponse } from '#interfaces/IVideoResponse'

export abstract class IVideoService {
  abstract findAll(): Promise<IMethodResponse<IVideoResponse[]>>
  abstract find(uuid: string): Promise<IMethodResponse<IVideoResponse | null>>
  abstract findByGenrer(genrerId: number): Promise<IMethodResponse<IVideoResponse[]>>
  abstract findByLanguage(languageId: number): Promise<IMethodResponse<IVideoResponse[]>>
  abstract delete(uuid: string): Promise<IMethodResponse<any>>
  abstract create(payload: IVideoCreateRequest): Promise<IMethodResponse<any>>
  abstract update(payload: IVideoCreateRequest, uuid: string): Promise<IMethodResponse<any>>
}
