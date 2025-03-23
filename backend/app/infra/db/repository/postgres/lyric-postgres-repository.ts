import db from '@adonisjs/lucid/services/db'

import { LyricFindResponse } from '#models/lyric-metadata'
import { LyricSaveResult } from '#models/lyric-save-result'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

import { LyricRepository } from '../_protocols/lyric-repository.js'

export class LyricPostgresRepository implements LyricRepository {
  async save(lyrics: LyricRepository.LyricParamsToInsert[]): Promise<LyricSaveResult> {
    await db
      .table('lyrics')
      .knexQuery.insert(lyrics.map(toSnakeCase))
      .onConflict(['video_id', 'seq'])
      .merge()

    await db
      .from('lyrics')
      .where('video_id', lyrics[0].videoId)
      .where('seq', '>', lyrics.length)
      .delete()

    const lyricsCount = await db.from('lyrics').where('video_id', lyrics[0].videoId).count('')

    return {
      countLyricsInserted: lyricsCount[0].count,
    }
  }

  async find(videoId: number): Promise<LyricFindResponse[]> {
    const lyrics = await db
      .from('lyrics')
      .where('video_id', videoId)
      .orderBy('seq', 'asc')
      .select(['line', 'start_time', 'end_time', 'seq'])

    return lyrics.map((lyric) => toCamelCase<LyricFindResponse>(lyric))
  }
}
