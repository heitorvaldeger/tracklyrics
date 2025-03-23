import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoSaveResult } from '#models/video-save'
import { VideoCreateProtocolService } from '#services/_protocols/video/video-create-protocol-service'

@inject()
export class VideoCreateService implements VideoCreateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: Auth,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository
  ) {}

  async create(payload: VideoCreateProtocolService.Params) {
    const uuid = randomUUID()

    if (await this.videoRepository.hasYoutubeLink(payload.linkYoutube)) {
      throw new YoutubeLinkAlreadyExistsException()
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

    return await this.videoRepository.create({
      ...payload,
      languageId: payload.languageId,
      genreId: payload.genreId,
      userId: this.authStrategy.getUserId(),
      uuid,
    })
  }
}
