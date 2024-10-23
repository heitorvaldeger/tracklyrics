import { IVideoResponse } from '#interfaces/IVideoResponse'

export abstract class IFindAllVideoRepository {
  abstract findAll(): Promise<IVideoResponse[]>
}
