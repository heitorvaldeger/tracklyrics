import { LyricFindResponse } from '#models/lyric-model/lyric-find-response'
import { LyricSaveResponse } from '#models/lyric-model/lyric-save-response'

export abstract class LyricRepository {
  abstract save(lyrics: LyricRepository.LyricParamsToInsert[]): Promise<LyricSaveResponse>
  abstract find(videoId: number): Promise<LyricFindResponse[]>
}

export namespace LyricRepository {
  export type LyricParamsToInsert = {
    seq: number
    line: string
    startTime: string
    endTime: string
    videoId: number
  }
}
