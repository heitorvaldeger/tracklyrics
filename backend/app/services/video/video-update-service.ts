import { VideoRepository } from '#repository/protocols/video-repository'
import { inject } from '@adonisjs/core'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { VideoUpdateProtocolService } from '#services/video/protocols/video-update-protocol-service'
import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'
import { GenreRepository, LanguageRepository } from '#repository/protocols/base-repository'

@inject()
export class VideoUpdateService implements VideoUpdateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authService: AuthProtocolService,
    private readonly videoCurrentUserService: VideoCurrentUserProtocolService,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async update(
    payload: VideoUpdateProtocolService.Params,
    uuid: string
  ): Promise<IMethodResponse<boolean>> {
    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      return createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    }
    if (await this.videoCurrentUserService.isNotVideoOwnedByCurrentUser(uuid)) {
      return createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
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
