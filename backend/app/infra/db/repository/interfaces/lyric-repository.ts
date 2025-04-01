import { Lyric } from '#models/lyric'
import { LyricFindResponse } from '#models/lyric-metadata'
import { LyricSaveResult } from '#models/lyric-save-result'

export abstract class ILyricRepository {
  abstract save(lyrics: ILyricRepository.LyricParamsToInsert[]): Promise<LyricSaveResult>
  abstract find(videoId: number): Promise<LyricFindResponse[]>
}

export namespace ILyricRepository {
  export type LyricParamsToInsert = Omit<Lyric, 'id'>
}
