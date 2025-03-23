import { inject } from '@adonisjs/core'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoUpdateProtocolService } from '#services/_protocols/video/video-update-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export class VideoUpdateService implements VideoUpdateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: Auth,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async update(payload: VideoUpdateProtocolService.Params, uuid: string) {
    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      throw new YoutubeLinkAlreadyExistsException()
    }
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(uuid)) {
      throw new VideoNotFoundException()
    }

    const [genre, language] = await Promise.all([
      this.genreRepository.findById(payload.genreId),
      this.languageRepository.findById(payload.languageId),
    ])

    if (!genre) {
      throw new GenreNotFoundException()
    }

    if (!language) {
      throw new LanguageNotFoundException()
    }

    return await this.videoRepository.update(
      {
        ...payload,
        languageId: payload.languageId,
        genreId: payload.genreId,
        userId: this.authStrategy.getUserId(),
      },
      uuid
    )
  }
}
