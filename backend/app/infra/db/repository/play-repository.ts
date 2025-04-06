import db from '@adonisjs/lucid/services/db'
import _ from 'lodash'
import { DateTime } from 'luxon'

import Play from '#models/play'
import { toSnakeCase } from '#utils/index'

import { IVideoPlayCountRepository } from './interfaces/video-play-count-repository.js'

export class PlayPostgresRepository implements IVideoPlayCountRepository {
  async increment(videoId: number) {
    const currentDateTime = DateTime.now()

    const q = Play.query()
      .where('videoId', videoId)
      .whereRaw('DATE(created_at) = ?', [currentDateTime.toFormat('yyyy-MM-dd')])
    if (!(await q.first())) {
      await Play.create({
        videoId,
      })
    } else {
      await q.increment('play_count', 1)
    }
  }
}
