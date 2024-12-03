import { VideoRepository } from '#repository/protocols/video-repository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { VideoFavoriteProtocolService } from '#services/video/protocols/video-favorite-protocol-service'
import { randomUUID } from 'node:crypto'
import _ from 'lodash'
import { FavoriteRepository } from '#repository/protocols/favorite-repository'
import { ApplicationError } from '#helpers/types/ApplicationError'
import { VideoCurrentUserProtocolService } from './protocols/video-currentuser-protocol-service.js'

@inject()
export class VideoFavoriteService implements VideoFavoriteProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly favoriteRepository: FavoriteRepository,
    private readonly authService: AuthProtocolService,
    private readonly videoCurrentUserService: VideoCurrentUserProtocolService
  ) {}

  async addFavorite(videoUuid: string): Promise<IMethodResponse<ApplicationError | boolean>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authService.getUserId()
    if (
      (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(videoUuid)) ||
      _.isNull(videoId) ||
      _.isNull(userId)
    ) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    const favoriteUuid = randomUUID()
    const added = await this.favoriteRepository.addFavorite(videoId, userId, favoriteUuid)

    if (!added) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE)
    }
    return createSuccessResponse(added)
  }

  async removeFavorite(videoUuid: string): Promise<IMethodResponse<boolean>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authService.getUserId()
    if (
      (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(videoUuid)) ||
      _.isNull(videoId) ||
      _.isNull(userId)
    ) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    const removed = await this.favoriteRepository.removeFavorite(videoId, userId)
    if (!removed) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_UNPOSSIBLE_REMOVE_TO_FAVORITE)
    }

    return createSuccessResponse(removed)
  }

  async findFavoritesByUserLogged(): Promise<IMethodResponse<any[]>> {
    const userId = this.authService.getUserId()
    const favorites = await this.favoriteRepository.findFavoritesByUser(userId)

    return createSuccessResponse(favorites)
  }
}
