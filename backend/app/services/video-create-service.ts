import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoCreateProtocolService } from '#services/_protocols/video/video-create-protocol-service'

@inject()
export class VideoCreateService implements VideoCreateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: Auth,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly lyricRepository: LyricRepository
  ) {}

  async create(payload: VideoCreateProtocolService.Params) {
    const { lyrics, linkYoutube, genreId, languageId, ...rest } = payload
    const uuid = randomUUID()

    if (await this.videoRepository.hasYoutubeLink(linkYoutube)) {
      throw new YoutubeLinkAlreadyExistsException()
    }

    const [genre, language] = await Promise.all([
      this.genreRepository.findById(genreId),
      this.languageRepository.findById(languageId),
    ])

    if (!genre) {
      throw new GenreNotFoundException()
    }

    if (!language) {
      throw new LanguageNotFoundException()
    }

    const video = await this.videoRepository.create({
      ...rest,
      linkYoutube,
      languageId,
      genreId,
      userId: this.authStrategy.getUserId(),
      uuid,
    })

    const videoId = await this.videoRepository.getVideoId(video.uuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const newLyricsToInsert = payload.lyrics.map((lyric, idx) => ({
      seq: ++idx,
      videoId,
      ...lyric,
    }))
    await this.lyricRepository.save(newLyricsToInsert)

    return video
  }
}
