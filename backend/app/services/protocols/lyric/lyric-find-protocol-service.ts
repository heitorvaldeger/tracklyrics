import { MethodResponse } from '#helpers/types/method-response'
import { LyricFindResponse } from '#models/lyric-model/lyric-find-response'

export abstract class LyricFindProtocolService {
  abstract find(videoUuid: string): Promise<MethodResponse<LyricFindResponse[]>>
}
