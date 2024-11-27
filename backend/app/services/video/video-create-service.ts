import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { IAuthService } from '#services/interfaces/IAuthService'
import { IVideoCreateService } from '#services/video/interfaces/IVideoCreateService'
import { VideoRequestParams } from '#params/video-params/video-request-params'
import { randomUUID } from 'node:crypto'

@inject()
export class VideoCreateService implements IVideoCreateService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly authService: IAuthService
  ) {}

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
}
