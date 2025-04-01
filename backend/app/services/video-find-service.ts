import { inject } from '@adonisjs/core'
import _ from 'lodash'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { FavoriteRepository } from '#infra/db/repository/_protocols/favorite-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoFindProtocolService } from '#services/_protocols/video-find-protocol-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class VideoFindService implements VideoFindProtocolService {
  constructor(
    private readonly auth: Auth,
    private readonly videoRepository: VideoRepository,
    private readonly favoriteRepository: FavoriteRepository
  ) {}

  async find(uuid: string) {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      throw new VideoNotFoundException()
    }

    const userId = this.auth.getUserId()
    if (userId) {
      video.isFavorite = await this.favoriteRepository.isFavoriteByUser(userId)
    } else {
      video.isFavorite = false
    }

    return {
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }
  }

  async findBy(filters: Partial<VideoRepository.FindVideoParams>) {
    const videos = await this.videoRepository.findBy(filters)

    return videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
  }
}
