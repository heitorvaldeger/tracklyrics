import { IVideoResponse } from '#interfaces/IVideoResponse'

export abstract class IFindVideoRepository {
  abstract find(uuid: string): Promise<IVideoResponse | null>
}
