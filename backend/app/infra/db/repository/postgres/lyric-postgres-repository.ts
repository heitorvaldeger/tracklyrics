import {
  ILyricRepository,
  LyricResponseWithoutIds,
  LyricToInsert,
} from '#infra/db/repository/interfaces/lyric-repository'
import { Lyric } from '#models/lyric'
import { Video } from '#models/video'

export class LyricPostgresRepository implements ILyricRepository {
  async save(lyrics: LyricToInsert[]) {
    if (!lyrics.length) {
      return {
        countLyricsInserted: 0,
      }
    }

    await Lyric.updateOrCreateMany(['videoId', 'seq'], lyrics)

    await Lyric.query()
      .where('videoId', lyrics[0].videoId)
      .where('seq', '>', lyrics.length)
      .delete()

    const lyricsCount = await Lyric.query().where('videoId', lyrics[0].videoId).count('')

    return {
      countLyricsInserted: lyricsCount[0].$extras.count,
    }
  }

  async find(videoId: number): Promise<LyricResponseWithoutIds[]> {
    return (
      await Lyric.query()
        .where('videoId', videoId)
        .orderBy('seq', 'asc')
        .select(['line', 'startTime', 'endTime', 'seq'])
    ).map((lyric) => lyric.serialize() as LyricResponseWithoutIds)
  }
}
