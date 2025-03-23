import { Lyric } from '#models/lyric'
import { LyricFindResponse } from '#models/lyric-metadata'
import { LyricSaveResult } from '#models/lyric-save-result'

export abstract class LyricRepository {
  abstract save(lyrics: LyricRepository.LyricParamsToInsert[]): Promise<LyricSaveResult>
  abstract find(videoId: number): Promise<LyricFindResponse[]>
}

export namespace LyricRepository {
  export type LyricParamsToInsert = Omit<Lyric, 'id'>
}
