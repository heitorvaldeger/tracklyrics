import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoCreateProtocolService } from './video-create-protocol-service.js'

export abstract class VideoUpdateProtocolService {
  abstract update(
    payload: VideoUpdateProtocolService.Params,
    uuid: string
  ): Promise<IMethodResponse<boolean>>
}

export namespace VideoUpdateProtocolService {
  export type Params = VideoCreateProtocolService.Params
}
