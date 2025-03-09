import { MethodResponse } from '#helpers/types/method-response'
import { LyricSaveResult } from '#models/lyric-save-result'

export abstract class LyricSaveProtocolService {
  abstract save(
    params: LyricSaveProtocolService.LyricParamsToInsert
  ): Promise<MethodResponse<LyricSaveResult>>
}

export namespace LyricSaveProtocolService {
  export type LyricParamsToInsert = {
    videoUuid: string
    lyrics: {
      line: string
      startTime: string
      endTime: string
    }[]
  }
}
