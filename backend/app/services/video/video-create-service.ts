import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { GenreRepository } from '#infra/db/repository/protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { VideoCreateProtocolService } from '#services/protocols/video/video-create-protocol-service'

@inject()
export class VideoCreateService implements VideoCreateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: AuthStrategy,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async create(
    payload: VideoCreateProtocolService.Params
  ): Promise<IMethodResponse<VideoSaveResultModel>> {
    const uuid = randomUUID()

    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS)
    }

    const [genre, language] = await Promise.all([
      this.genreRepository.findById(payload.genreId),
      this.languageRepository.findById(payload.languageId),
    ])

    if (!genre) {
      return createFailureResponse(APPLICATION_MESSAGES.GENRE_NOT_FOUND)
    }

    if (!language) {
      return createFailureResponse(APPLICATION_MESSAGES.LANGUAGE_NOT_FOUND)
    }

    const newVideo = await this.videoRepository.create({
      ...payload,
      languageId: payload.languageId,
      genreId: payload.genreId,
      userId: this.authStrategy.getUserId(),
      uuid,
    })

    return createSuccessResponse(newVideo)
  }
}
