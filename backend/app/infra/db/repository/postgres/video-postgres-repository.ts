import string from '@adonisjs/core/helpers/string'
import db from '@adonisjs/lucid/services/db'

import { Lyric } from '#models/lyric'
import { Video } from '#models/video'
import { VideoCreateInput, VideoSaveResult, VideoUpdateInput } from '#models/video-save'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

import { IVideoRepository, VideoResponse } from '../interfaces/video-repository.js'

export class VideoPostgresRepository implements IVideoRepository {
  async find(uuid: string) {
    const video = await Video.query()
      .where('uuid', uuid)
      .preload('user')
      .preload('language')
      .preload('genre')
      .first()

    if (!video) return null

    return {
      title: video.title,
      artist: video.artist,
      linkYoutube: video.linkYoutube,
      uuid: video.uuid,
      releaseYear: video.releaseYear,
      genre: video.genre.name,
      language: video.language.name,
      username: video.user.username,
    } as VideoResponse
  }

  async findBy(filters: IVideoRepository.FindVideoParams): Promise<VideoResponse[]> {
    const vq = Video.query().preload('user').preload('language').preload('genre')

    for (const [key, value] of Object.entries(toSnakeCase(filters))) {
      if (!value) continue

      if (key === 'user_uuid') {
        vq.whereHas('user', (q) => {
          q.where('uuid', value)
        })
      } else {
        if (this.getParamValidToFindBy().includes(key as keyof IVideoRepository.FindVideoParams)) {
          const table = string.create(key).removeSuffix('_id').toString() as 'language' | 'genre'
          vq.whereHas(table, (q) => {
            q.where('id', value)
          })
        }
      }
    }

    const videos = await vq.select()

    return videos.map((video) => ({
      title: video.title,
      artist: video.artist,
      linkYoutube: video.linkYoutube,
      uuid: video.uuid,
      releaseYear: video.releaseYear,
      genre: video.genre.name,
      language: video.language.name,
      username: video.user.username,
    })) as VideoResponse[]
  }

  async getVideoId(videoUuid: string): Promise<number | null> {
    const video = await Video.findBy('uuid', videoUuid)
    return video?.id ?? null
  }

  async getVideoUuidByYoutubeURL(youtubeURL: string): Promise<string | undefined> {
    const video = await Video.findBy('linkYoutube', youtubeURL)
    return video?.uuid
  }

  async getUserId(videoUuid: string): Promise<number | null> {
    const video = await Video.findBy('uuid', videoUuid)
    return video?.userId ?? null
  }

  async hasYoutubeLink(link: string): Promise<boolean> {
    return !!(await Video.findBy('linkYoutube', link))
  }

  async delete(videoUuid: string): Promise<boolean> {
    await db
      .from('favorites')
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .delete()

    await Lyric.query()
      .whereIn('videoId', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .delete()

    await db
      .from('video_play_counts')
      .whereIn('video_id', (query) => {
        query.from('videos').where('uuid', videoUuid).select('id')
      })
      .delete()

    await Video.query().where('uuid', videoUuid).delete()
    return !(await db.from('videos').where('uuid', videoUuid).first())
  }

  async create(payload: VideoCreateInput): Promise<VideoSaveResult> {
    const video = await Video.create(payload)
    return video.serialize({
      fields: {
        omit: ['id', 'genre', 'language', 'user'],
      },
    }) as VideoSaveResult
  }

  async update(payload: VideoUpdateInput, uuid: string): Promise<boolean> {
    const video = await Video.findBy('uuid', uuid)
    return !!(await video?.merge(payload).save())
  }

  private getParamValidToFindBy(): Array<string> {
    return ['language_id', 'genre_id', 'user_uuid']
  }
}
