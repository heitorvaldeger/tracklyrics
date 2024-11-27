import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRequestParams } from '../params/video-params/video-request-params.js'
import { randomUUID } from 'node:crypto'
import { VideoFindParams } from '../params/video-params/video-find-params.js'
import { IAuthService } from './interfaces/IAuthService.js'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { ApplicationError } from '#helpers/types/ApplicationError'
import _ from 'lodash'
import { IFavoriteRepository } from '#repository/interfaces/IFavoriteRepository'

@inject()
export class VideoService implements IVideoService {
  constructor(
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly videoRepository: IVideoRepository,
    private readonly authService: IAuthService
  ) {}

  async find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>> {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    return createSuccessResponse(video)
  }

  async findBy(filters: Partial<VideoFindParams>): Promise<IMethodResponse<VideoFindModel[]>> {
    const videos = await this.videoRepository.findBy(filters)
    return createSuccessResponse(videos)
  }

  async create(payload: VideoRequestParams): Promise<IMethodResponse<any>> {
    const uuid = randomUUID()

    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    }

    const newVideo = await this.videoRepository.create({
      ...payload,
      languageId: payload.languageId,
      genreId: payload.genreId,
      userId: this.authService.getUserId(),
      uuid,
    })

    return createSuccessResponse(newVideo)
  }

  async update(payload: VideoRequestParams, uuid: string): Promise<IMethodResponse<boolean>> {
    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    }
    if (await this.isNotVideoOwnedByCurrentUser(uuid)) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    const isSuccess = await this.videoRepository.update(
      {
        ...payload,
        languageId: payload.languageId,
        genreId: payload.genreId,
        userId: this.authService.getUserId(),
      },
      uuid
    )

    return createSuccessResponse(isSuccess)
  }

  async addFavorite(videoUuid: string): Promise<IMethodResponse<ApplicationError | boolean>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    const userId = this.authService.getUserId()
    if (
      (await this.isNotVideoOwnedByCurrentUser(videoUuid)) ||
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
      (await this.isNotVideoOwnedByCurrentUser(videoUuid)) ||
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

  private async isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean> {
    const userId = this.authService.getUserId()
    const userIdFromVideo = await this.videoRepository.getUserId(videoUuid)

    return userIdFromVideo !== userId
  }
}
