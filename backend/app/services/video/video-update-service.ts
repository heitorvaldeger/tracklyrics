import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { GenreRepository } from '#infra/db/repository/protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { VideoCurrentUserProtocolService } from '#services/protocols/video/video-currentuser-protocol-service'
import { VideoUpdateProtocolService } from '#services/protocols/video/video-update-protocol-service'

@inject()
export class VideoUpdateService implements VideoUpdateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: AuthStrategy,
    private readonly videoCurrentUserService: VideoCurrentUserProtocolService,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async update(
    payload: VideoUpdateProtocolService.Params,
    uuid: string
  ): Promise<IMethodResponse<boolean>> {
    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS)
    }
    if (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(uuid)) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
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

    const isSuccess = await this.videoRepository.update(
      {
        ...payload,
        languageId: payload.languageId,
        genreId: payload.genreId,
        userId: this.authStrategy.getUserId(),
      },
      uuid
    )

    return createSuccessResponse(isSuccess)
  }
}
