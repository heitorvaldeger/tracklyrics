import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'

import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'

import { GenreRepository, LanguageRepository } from '../../infra/db/protocols/base-repository.js'
import { VideoRepository } from '../../infra/db/protocols/video-repository.js'

@inject()
export class VideoCreateService implements VideoCreateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authService: AuthProtocolService,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async create(
    payload: VideoCreateProtocolService.Params
  ): Promise<IMethodResponse<VideoSaveResultModel>> {
    const uuid = randomUUID()

    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    }

    const [genre, language] = await Promise.all([
      this.genreRepository.findById(payload.genreId),
      this.languageRepository.findById(payload.languageId),
    ])

    if (!genre) {
      return createFailureResponse(APPLICATION_ERRORS.GENRE_NOT_FOUND)
    }

    if (!language) {
      return createFailureResponse(APPLICATION_ERRORS.LANGUAGE_NOT_FOUND)
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
