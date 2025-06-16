import {
  ILyricRepository,
  LyricResponseWithoutIds,
  LyricToInsert,
} from '#infra/db/repository/interfaces/lyric-repository'
import { Lyric } from '#models/lyric'
import { Video } from '#models/video'

export class LyricPostgresRepository implements ILyricRepository {
  async save(lyrics: LyricToInsert[], videoId: number) {
    await Lyric.query()
      .where('videoId', videoId)
      .whereNotIn(
        'seq',
        lyrics.map((lyric) => lyric.seq)
      )
      .delete()

    await Lyric.updateOrCreateMany(['videoId', 'seq'], lyrics)
    const video = await Video.query().withCount('lyrics').first()

    return {
      lyricsCount: video?.$extras.lyrics_count,
    }
  }

  async find(videoId: number) {
    return (
      await Lyric.query()
        .where('videoId', videoId)
        .orderBy('seq', 'asc')
        .select(['line', 'startTime', 'endTime', 'seq'])
    ).map((lyric) => lyric.serialize() as LyricResponseWithoutIds)
  }
}
