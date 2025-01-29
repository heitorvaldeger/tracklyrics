import db from '@adonisjs/lucid/services/db'
import _ from 'lodash'
import { DateTime } from 'luxon'

import { toSnakeCase } from '#helpers/to-snake-case'

import { VideoPlayCountRepository } from '../protocols/video-play-count-repository.js'

export class VideoPlayCountPostgresRepository implements VideoPlayCountRepository {
  async increment(videoId: number): Promise<void> {
    const currentDateTime = DateTime.now()

    const query = db
      .from('video_play_counts')
      .where('video_id', videoId)
      .whereRaw('DATE(created_at) = ?', [currentDateTime.toFormat('yyyy-MM-dd')])
    if (!(await query.first())) {
      await db.table('video_play_counts').insert(
        toSnakeCase({
          videoId,
          createdAt: currentDateTime,
        })
      )
    } else {
      await query.increment('play_count', 1)
    }
  }
}
