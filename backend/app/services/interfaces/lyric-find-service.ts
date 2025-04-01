import { LyricFindResponse } from '#models/lyric-metadata'

export abstract class ILyricFindService {
  abstract find(videoUuid: string): Promise<LyricFindResponse[]>
}
