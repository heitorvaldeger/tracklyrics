import { VideoRepository } from '#repository/protocols/video-repository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'
import { randomUUID } from 'node:crypto'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'

@inject()
export class VideoCreateService implements VideoCreateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authService: AuthProtocolService
  ) {}

  async create(
    payload: VideoCreateProtocolService.Params
  ): Promise<IMethodResponse<VideoSaveResultModel>> {
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
