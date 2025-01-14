import db from '@adonisjs/lucid/services/db'
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'

import { toCamelCase } from '#helpers/to-camel-case'
import { toSnakeCase } from '#helpers/to-snake-case'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import { LyricLucid } from '#models/lyric-model/lyric-lucid'
import { VideoFindModel } from '#models/video-model/video-find-model'
import VideoLucid from '#models/video-model/video-lucid'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'
import VideoPlayCountLucid from '#models/video-play-count/video-play-count-lucid'

import { VideoRepository } from '../protocols/video-repository.js'

export class VideoPostgresRepository implements VideoRepository {
  async find(uuid: string): Promise<VideoFindModel | null> {
    const video: VideoFindModel | null = await db
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

  async findBy(filters: VideoRepository.FindVideoParams): Promise<VideoFindModel[]> {
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

    const videos: VideoFindModel[] = await qb.select(
      'title',
      'artist',
      'videos.uuid',
      'release_year',
      'link_youtube',
      'languages.name as language',
      'users.username as username'
    )

    return videos.map((video) => toCamelCase(video))
  }

  async getVideoId(videoUuid: string): Promise<number | null> {
    const video = await VideoLucid.findBy('uuid', videoUuid)
    return video ? video.id : null
  }

  async getUserId(videoUuid: string): Promise<number | null> {
    const video = await VideoLucid.findBy('uuid', videoUuid)
    return video ? video.userId : null
  }

  async hasYoutubeLink(link: string): Promise<boolean> {
    return !!(await db.from('videos').whereLike('link_youtube', link).first())
  }

  async delete(videoUuid: string): Promise<boolean> {
    await FavoriteLucid.query()
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .del()
    await LyricLucid.query()
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .del()
    await VideoPlayCountLucid.query()
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .del()
    await VideoLucid.query().where('uuid', videoUuid).delete()
    return !(await VideoLucid.query().where('uuid', videoUuid).first())
  }

  async create(payload: VideoRepository.CreateVideoParams): Promise<VideoSaveResultModel> {
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

    return toCamelCase<VideoSaveResultModel>(newVideo)
  }

  async update(payload: VideoRepository.UpdateVideoParams, uuid: string): Promise<boolean> {
    await db.from('videos').where('uuid', uuid).update(toSnakeCase(payload))
    return !!(await db.from('videos').where('uuid', uuid).first())
  }

  private getParamValidToFindBy(): Array<string> {
    return ['language_id', 'genre_id', 'user_uuid']
  }
}
