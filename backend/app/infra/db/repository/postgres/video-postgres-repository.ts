import db from '@adonisjs/lucid/services/db'

import { Video } from '#models/video'
import { VideoMetadata } from '#models/video-metadata'
import { VideoCreateInput, VideoSaveResult, VideoUpdateInput } from '#models/video-save'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

import { VideoRepository } from '../_protocols/video-repository.js'

export class VideoPostgresRepository implements VideoRepository {
  async find(uuid: string): Promise<VideoMetadata | null> {
    const video: VideoMetadata | null = await db
      .from('videos')
      .where('videos.uuid', uuid)
      .innerJoin('users', 'users.id', 'user_id')
      .innerJoin('languages', 'languages.id', 'language_id')
      .innerJoin('genres', 'genres.id', 'genre_id')
      .select(
        'title',
        'artist',
        'link_youtube',
        'videos.uuid',
        'release_year',
        'genres.name as genre',
        'languages.name as language',
        'users.username as username'
      )
      .first()

    return video ? toCamelCase(video) : null
  }

  async findBy(filters: VideoRepository.FindVideoParams): Promise<VideoMetadata[]> {
    const qb = db
      .from('videos')
      .innerJoin('users', 'users.id', 'user_id')
      .innerJoin('languages', 'languages.id', 'language_id')
      .innerJoin('genres', 'genres.id', 'genre_id')
    for (const [key, value] of Object.entries(toSnakeCase(filters))) {
      if (!value) continue

      if (key === 'user_uuid') {
        qb.whereIn('user_id', (query) => {
          query.from('users').where('uuid', value).select('id')
        })
      } else {
        if (this.getParamValidToFindBy().includes(key as keyof VideoRepository.FindVideoParams)) {
          qb.where(key, value)
        }
      }
    }

    const videos: VideoMetadata[] = await qb.select(
      'title',
      'artist',
      'videos.uuid',
      'release_year',
      'link_youtube',
      'genres.name as genre',
      'languages.name as language',
      'users.username as username'
    )

    return videos.map((video) => toCamelCase(video))
  }

  async getVideoId(videoUuid: string): Promise<number | null> {
    const video: Video | null = await db.from('videos').where('uuid', videoUuid).first()
    return video ? video.id : null
  }

  async getVideoUuidByYoutubeURL(youtubeURL: string): Promise<string | undefined> {
    const video: Video | null = await db.from('videos').where('link_youtube', youtubeURL).first()
    return video?.uuid
  }

  async getUserId(videoUuid: string): Promise<number | null> {
    const video: Video | null = await db.from('videos').where('uuid', videoUuid).first()
    return video ? toCamelCase(video).userId : null
  }

  async hasYoutubeLink(link: string): Promise<boolean> {
    return !!(await db.from('videos').whereLike('link_youtube', link).first())
  }

  async delete(videoUuid: string): Promise<boolean> {
    await db
      .from('favorites')
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .del()
    await db
      .from('lyrics')
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .del()

    await db
      .from('video_play_counts')
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .del()

    await db.from('videos').where('uuid', videoUuid).delete()
    return !(await db.from('videos').where('uuid', videoUuid).first())
  }

  async create(payload: VideoCreateInput): Promise<VideoSaveResult> {
    await db.from('videos').knexQuery.insert(toSnakeCase(payload))
    const newVideo = await db
      .from('videos')
      .where('uuid', payload.uuid)
      .select(
        'title',
        'artist',
        'uuid',
        'release_year',
        'link_youtube',
        'is_draft',
        'user_id',
        'language_id',
        'genre_id'
      )
      .first()

    if (!newVideo) {
      throw new Error(
        'An error occurred during the video creation process. Please try again or contact support if the issue persists.'
      )
    }

    return toCamelCase<VideoSaveResult>(newVideo)
  }

  async update(payload: VideoUpdateInput, uuid: string): Promise<boolean> {
    await db.from('videos').where('uuid', uuid).update(toSnakeCase(payload))
    return !!(await db.from('videos').where('uuid', uuid).first())
  }

  private getParamValidToFindBy(): Array<string> {
    return ['language_id', 'genre_id', 'user_uuid']
  }
}
