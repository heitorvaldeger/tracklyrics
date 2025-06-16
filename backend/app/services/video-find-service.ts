import { inject } from '@adonisjs/core'
import _ from 'lodash'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { Auth } from '#infra/auth/interfaces/auth'
import { IFavoriteRepository } from '#infra/db/repository/interfaces/favorite-repository'
import { IVideoRepository, VideoFindParams } from '#infra/db/repository/interfaces/video-repository'
import { IVideoFindService } from '#services/interfaces/video-find-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class VideoFindService implements IVideoFindService {
  constructor(
    private readonly auth: Auth,
    private readonly videoRepository: IVideoRepository,
    private readonly favoriteRepository: IFavoriteRepository
  ) {}

  async find(uuid: string) {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      throw new VideoNotFoundException()
    }

    const userId = this.auth.getUserId()
    if (userId) {
      video.isFavorite = await this.favoriteRepository.isFavoriteByUser(userId, video.uuid)
    } else {
      video.isFavorite = false
    }

    return {
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }
  }

  async findBy(filters: VideoFindParams) {
    const videos = await this.videoRepository.findBy(filters)

    return videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
  }
}
