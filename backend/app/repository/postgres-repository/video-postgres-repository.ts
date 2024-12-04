import db from '@adonisjs/lucid/services/db'
import { VideoRepository } from '#repository/protocols/video-repository'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { toSnakeCase } from '#helpers/to-snake-case'
import { toCamelCase } from '#helpers/to-camel-case'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import VideoLucid from '#models/video-model/video-lucid'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'

export class VideoPostgresRepository implements VideoRepository {
  async find(uuid: string): Promise<VideoFindModel | null> {
    const qb = db
      .from('videos')
      .where('videos.uuid', uuid)
      .innerJoin('users', 'users.id', 'user_id')
      .innerJoin('languages', 'languages.id', 'language_id')
      .innerJoin('genres', 'genres.id', 'genre_id')

    const video: VideoFindModel | null = await this.selectFind(qb).first()

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

    const videos: VideoFindModel[] = await this.selectFind(qb)

    return this.mapperVideoList(videos)
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
        'qty_views',
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

  private mapperVideoList(videos: VideoFindModel[]) {
    return videos.map((video) => toCamelCase(video))
  }

  private getParamValidToFindBy(): Array<string> {
    return ['language_id', 'genre_id', 'user_uuid']
  }

  private selectFind(qb: DatabaseQueryBuilderContract<any>) {
    return qb.select(
      'title',
      'artist',
      'videos.uuid',
      'release_year',
      'link_youtube',
      'qty_views',
      'is_draft',
      'languages.name as language',
      'genres.name as genre',
      'users.username as username'
    )
  }
}
