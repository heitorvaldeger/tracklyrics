import db from '@adonisjs/lucid/services/db'

import {
  ILyricRepository,
  LyricResponseWithoutIds,
  LyricToInsert,
} from '#infra/db/repository/interfaces/lyric-repository'
import { Lyric } from '#models/lyric'
import { toSnakeCase } from '#utils/index'

export class LyricPostgresRepository implements ILyricRepository {
  async save(lyrics: LyricToInsert[]) {
    if (!lyrics.length) {
      return {
        countLyricsInserted: 0,
      }
    }

    await db
      .table('lyrics')
      .knexQuery.insert(lyrics.map(toSnakeCase))
      .onConflict(['video_id', 'seq'])
      .merge()

    await Lyric.query().where('videoId', lyrics[0].videoId).where('seq', '>', lyrics.length).del()

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
