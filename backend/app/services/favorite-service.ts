import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import _ from 'lodash'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { FavoriteRepository } from '#infra/db/repository/protocols/favorite-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { FavoriteProtocolService } from '#services/protocols/favorite-protocol-service'
import { VideoCurrentUserProtocolService } from '#services/protocols/video/video-currentuser-protocol-service'

@inject()
export class FavoriteService implements FavoriteProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly favoriteRepository: FavoriteRepository,
    private readonly authStrategy: AuthStrategy,
    private readonly videoCurrentUserService: VideoCurrentUserProtocolService
  ) {}

  async addFavorite(videoUuid: string): Promise<IMethodResponse<ApplicationError | boolean>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authStrategy.getUserId()
    if (
      (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(videoUuid)) ||
      _.isNull(videoId) ||
      _.isNull(userId)
    ) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const favoriteUuid = randomUUID()
    const added = await this.favoriteRepository.addFavorite(videoId, userId, favoriteUuid)

    if (!added) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE)
    }
    return createSuccessResponse(added)
  }

  async removeFavorite(videoUuid: string): Promise<IMethodResponse<boolean>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authStrategy.getUserId()
    if (
      (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(videoUuid)) ||
      _.isNull(videoId) ||
      _.isNull(userId)
    ) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const removed = await this.favoriteRepository.removeFavorite(videoId, userId)
    if (!removed) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_UNPOSSIBLE_REMOVE_TO_FAVORITE)
    }

    return createSuccessResponse(removed)
  }

  async findFavoritesByUserLogged(): Promise<IMethodResponse<any[]>> {
    const userId = this.authStrategy.getUserId()
    const favorites = await this.favoriteRepository.findFavoritesByUser(userId)

    return createSuccessResponse(favorites)
  }
}
