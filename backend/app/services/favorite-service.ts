import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import _ from 'lodash'

import GenericException from '#exceptions/generic-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { FavoriteRepository } from '#infra/db/repository/_protocols/favorite-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { FavoriteProtocolService } from '#services/_protocols/favorite-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video-user-logged-protocol-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class FavoriteService implements FavoriteProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly favoriteRepository: FavoriteRepository,
    private readonly authStrategy: Auth,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService
  ) {}

  async saveFavorite(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authStrategy.getUserId()
    if (
      (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(videoUuid)) ||
      _.isNull(videoId) ||
      _.isNull(userId)
    ) {
      throw new VideoNotFoundException()
    }

    const favoriteUuid = randomUUID()
    const added = await this.favoriteRepository.saveFavorite(videoId, userId, favoriteUuid)

    if (!added) {
      throw new GenericException()
    }

    return added
  }

  async removeFavorite(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authStrategy.getUserId()
    if (
      (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(videoUuid)) ||
      _.isNull(videoId) ||
      _.isNull(userId)
    ) {
      throw new VideoNotFoundException()
    }

    const removed = await this.favoriteRepository.removeFavorite(videoId, userId)
    if (!removed) {
      throw new GenericException()
    }

    return removed
  }

  async findFavoritesByUserLogged() {
    const userId = this.authStrategy.getUserId()
    const videos = await this.favoriteRepository.findFavoritesByUser(userId)

    const videosWithThumbnail = videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
    return videosWithThumbnail
  }
}
