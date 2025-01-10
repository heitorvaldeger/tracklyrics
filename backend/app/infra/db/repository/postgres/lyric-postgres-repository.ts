import { inject } from '@adonisjs/core'
import { orderBy } from 'lodash'

import { LyricFindResponse } from '#models/lyric-model/lyric-find-response'
import { LyricLucid } from '#models/lyric-model/lyric-lucid'
import { LyricSaveResponse } from '#models/lyric-model/lyric-save-response'

import { LyricRepository } from '../protocols/lyric-repository.js'

@inject()
export class LyricPostgresRepository implements LyricRepository {
  async save(lyrics: LyricRepository.LyricParamsToInsert[]): Promise<LyricSaveResponse> {
    const lyricsInserted = await LyricLucid.updateOrCreateMany(['videoId', 'seq'], lyrics)
    await LyricLucid.query()
      .where('videoId', lyrics[0].videoId)
      .where('seq', '>', lyrics.length)
      .delete()
    return {
      countLyricsInserted: lyricsInserted.length,
    }
  }

  async find(videoId: number): Promise<LyricFindResponse[]> {
    const lyrics = await LyricLucid.query()
      .where('videoId', videoId)
      .orderBy('seq', 'asc')
      .select(['line', 'start_time', 'end_time', 'seq'])
    return lyrics.map((lyric) => lyric.serialize()) as LyricFindResponse[]
  }
}
