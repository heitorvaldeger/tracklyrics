import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { IAuthService } from '#services/interfaces/IAuthService'
import { IVideoUpdateService } from '#services/video/interfaces/IVideoUpdateService'
import { VideoRequestParams } from '#params/video-params/video-request-params'
import { IVideoCurrentUserService } from '#services/video/interfaces/IVideoCurrentUserService'

@inject()
export class VideoUpdateService implements IVideoUpdateService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly authService: IAuthService,
    private readonly videoCurrentUserService: IVideoCurrentUserService
  ) {}

  async update(payload: VideoRequestParams, uuid: string): Promise<IMethodResponse<boolean>> {
    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    }
    if (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(uuid)) {
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
}
