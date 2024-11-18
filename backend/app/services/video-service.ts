import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { VideoRequestParams } from '../params/video/video-request-params.js'
import { randomUUID } from 'node:crypto'
import { VideoFindParams } from '../params/video/video-find-params.js'
import { IAuthService } from './interfaces/IAuthService.js'
import { VideoFindModel } from '#models/video/video-find-model'
import { IApplicationError } from '#helpers/interfaces/IApplicationError'
import _ from 'lodash'

@inject()
export class VideoService implements IVideoService {
  constructor(
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

  async delete(uuid: string): Promise<IMethodResponse<boolean>> {
    if (await this.isNotVideoOwnedByCurrentUser(uuid)) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    }

    const isSuccess = await this.videoRepository.delete(uuid)
    return createSuccessResponse(isSuccess)
  }

  async create(payload: VideoRequestParams): Promise<IMethodResponse<any>> {
    const uuid = randomUUID()

    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    }

    const newVideo = await this.videoRepository.create({
      ...payload,
      languageId: payload.languageId,
      genrerId: payload.genrerId,
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
        genrerId: payload.genrerId,
        userId: this.authService.getUserId(),
      },
      uuid
    )

    return createSuccessResponse(isSuccess)
  }

  async addFavorite(videoUuid: string): Promise<IMethodResponse<IApplicationError | boolean>> {
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
    const added = await this.videoRepository.addFavorite(videoId, userId, favoriteUuid)

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

    const removed = await this.videoRepository.removeFavorite(videoId, userId)
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
