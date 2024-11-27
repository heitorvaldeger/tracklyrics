import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { IAuthService } from '#services/interfaces/IAuthService'
import { IVideoFavoriteService } from '#services/video/interfaces/IVideoFavoriteService'
import { VideoRequestParams } from '#params/video-params/video-request-params'
import { randomUUID } from 'node:crypto'
import _ from 'lodash'
import { IFavoriteRepository } from '#repository/interfaces/IFavoriteRepository'
import { ApplicationError } from '#helpers/types/ApplicationError'
import { IVideoCurrentUserService } from './interfaces/IVideoCurrentUserService.js'

@inject()
export class VideoFavoriteService implements IVideoFavoriteService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly authService: IAuthService,
    private readonly videoCurrentUserService: IVideoCurrentUserService
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
}
