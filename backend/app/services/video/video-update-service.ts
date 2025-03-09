import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoUpdateProtocolService } from '#services/_protocols/video/video-update-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

@inject()
export class VideoUpdateService implements VideoUpdateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: AuthStrategy,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async update(
    payload: VideoUpdateProtocolService.Params,
    uuid: string
  ): Promise<MethodResponse<boolean>> {
    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS)
    }
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(uuid)) {
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
