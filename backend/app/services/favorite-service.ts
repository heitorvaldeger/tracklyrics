import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import _ from 'lodash'

import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { FavoriteProtocolService } from '#services/protocols/favorite-protocol-service'

import { FavoriteRepository } from '../infra/db/protocols/favorite-repository.js'
import { VideoRepository } from '../infra/db/protocols/video-repository.js'
import { VideoCurrentUserProtocolService } from './video/protocols/video-currentuser-protocol-service.js'

@inject()
export class FavoriteService implements FavoriteProtocolService {
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
