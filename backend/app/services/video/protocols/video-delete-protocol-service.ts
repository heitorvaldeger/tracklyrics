import { IMethodResponse } from '#helpers/types/IMethodResponse'

export abstract class VideoDeleteProtocolService {
  abstract delete(uuid: string): Promise<IMethodResponse<boolean>>
}
