import { MethodResponse } from '#helpers/types/method-response'
import { LyricSaveResponse } from '#models/lyric-model/lyric-save-response'

export abstract class LyricSaveProtocolService {
  abstract save(
    params: LyricSaveProtocolService.LyricParamsToInsert
  ): Promise<MethodResponse<LyricSaveResponse>>
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
