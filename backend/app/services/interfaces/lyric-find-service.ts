import { LyricResponseWithoutIds } from '#core/infra/db/repository/interfaces/lyric-repository'

export abstract class ILyricFindService {
  abstract find(videoUuid: string): Promise<LyricResponseWithoutIds[]>
}
