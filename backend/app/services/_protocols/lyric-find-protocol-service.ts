import { LyricFindResponse } from '#models/lyric-metadata'

export abstract class LyricFindProtocolService {
  abstract find(videoUuid: string): Promise<LyricFindResponse[]>
}
