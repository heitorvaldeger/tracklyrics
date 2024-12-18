import { MethodResponse } from '#helpers/types/method-response'

export abstract class VideoDeleteProtocolService {
  abstract delete(uuid: string): Promise<MethodResponse<boolean>>
}
