import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoSaveResult } from '#models/video-save'
import { VideoCreateProtocolService } from '#services/_protocols/video/video-create-protocol-service'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

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
  ): Promise<MethodResponse<VideoSaveResult>> {
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
