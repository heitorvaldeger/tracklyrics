import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import _ from 'lodash'

import { Auth } from '#core/infra/auth/interfaces/auth'
import { IFavoriteRepository } from '#core/infra/db/repository/interfaces/favorite-repository'
import { IVideoRepository } from '#core/infra/db/repository/interfaces/video-repository'
import GenericException from '#exceptions/generic-exception'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { IFavoriteService } from '#services/interfaces/favorite-service'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class FavoriteService implements IFavoriteService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly auth: Auth,
    private readonly videoCurrentUserService: IVideoUserLoggedService
  ) {}

  async saveFavorite(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.auth.getUserId()!
    if ((await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(videoUuid)) || !videoId) {
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
    const userId = this.auth.getUserId()!
    if ((await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(videoUuid)) || !videoId) {
      throw new VideoNotFoundException()
    }

    const removed = await this.favoriteRepository.removeFavorite(videoId, userId)
    if (!removed) {
      throw new GenericException()
    }

    return removed
  }

  async findFavoritesByUserLogged() {
    const userId = this.auth.getUserId()
    if (!userId) {
      throw new UnauthorizedException()
    }
    const videos = await this.favoriteRepository.findFavoritesByUser(userId)

    const videosWithThumbnail = videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
    return videosWithThumbnail
  }
}
