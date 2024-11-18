import db from '@adonisjs/lucid/services/db'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { VideoFindParams } from '../../params/video/video-find-params.js'
import Favorite from '#models/lucid-orm/favorite'
import { VideoFindModel } from '#models/video/video-find-model'
import { VideoSaveParams } from '../../params/video/video-save-params.js'
import { toSnakeCase } from '#helpers/to-snake-case'
import { toCamelCase } from '#helpers/to-camel-case'
import { VideoSaveResultModel } from '#models/video/video-save-result-model'
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import VideoLucid from '#models/video/video-lucid'
import { APPLICATION_ERRORS } from '#helpers/application-errors'

export class VideoPostgresRepository implements IVideoRepository {
  async find(uuid: string): Promise<VideoFindModel | null> {
    const qb = db
      .from('videos')
      .where('videos.uuid', uuid)
      .innerJoin('users', 'users.id', 'user_id')
      .innerJoin('languages', 'languages.id', 'language_id')
      .innerJoin('genrers', 'genrers.id', 'genrer_id')

    const video: VideoFindModel | null = await this.selectFind(qb).first()

    return video ? toCamelCase(video) : null
  }

  async findBy(filters: Partial<VideoFindParams>): Promise<VideoFindModel[]> {
    const qb = db
      .from('videos')
      .innerJoin('users', 'users.id', 'user_id')
      .innerJoin('languages', 'languages.id', 'language_id')
      .innerJoin('genrers', 'genrers.id', 'genrer_id')
    for (const [key, value] of Object.entries(toSnakeCase(filters))) {
      if (!value) continue

      if (key === 'user_uuid') {
        qb.whereIn('user_id', (query) => {
          query.from('users').where('uuid', value).select('id')
        })
      } else {
        if (this.getParamValidToFindBy().includes(key as keyof VideoFindParams)) {
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
    await VideoLucid.query().where('uuid', videoUuid).delete()
    return !(await VideoLucid.query().where('uuid', videoUuid).first())
  }

  async create(payload: VideoSaveParams): Promise<VideoSaveResultModel> {
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
        'genrer_id'
      )
      .first()

    if (!newVideo) {
      throw new Error(
        'An error occurred during the video creation process. Please try again or contact support if the issue persists.'
      )
    }

    return toCamelCase<VideoSaveResultModel>(newVideo)
  }

  async update(payload: Partial<VideoSaveParams>, uuid: string): Promise<boolean> {
    await db.from('videos').where('uuid', uuid).update(toSnakeCase(payload))
    return !!(await db.from('videos').where('uuid', uuid).first())
  }

  async addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean> {
    const favoriteAdded = await Favorite.create({
      videoId,
      userId,
      uuid: favoriteUuid,
    })
    return favoriteAdded.$isPersisted
  }

  async removeFavorite(videoId: number, userId: number): Promise<boolean> {
    await Favorite.query().where('videoId', videoId).where('userId', userId).delete()
    return !(await Favorite.query().where('videoId', videoId).where('userId', userId).first())
  }

  private mapperVideoList(videos: VideoFindModel[]) {
    return videos.map((video) => toCamelCase(video))
  }

  private getParamValidToFindBy(): Array<string> {
    return ['language_id', 'genrer_id', 'user_uuid']
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
      'genrers.name as genrer',
      'users.username as username'
    )
  }
}
