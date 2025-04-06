import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { Auth } from '#infra/auth/interfaces/auth'
import { IGenreRepository } from '#infra/db/repository/interfaces/genre-repository'
import { ILanguageRepository } from '#infra/db/repository/interfaces/language-repository'
import { ILyricRepository } from '#infra/db/repository/interfaces/lyric-repository'
import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'
import { IVideoCreateService } from '#services/interfaces/video-create-service'

@inject()
export class VideoCreateService implements IVideoCreateService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly auth: Auth,
    private readonly genreRepository: IGenreRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly lyricRepository: ILyricRepository
  ) {}

  async create(payload: IVideoCreateService.Params) {
    const { lyrics, linkYoutube, genreId, languageId, ...rest } = payload
    const uuid = randomUUID()

    const userId = this.auth.getUserId()!

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
      userId,
      uuid,
    })

    const videoId = await this.videoRepository.getVideoId(video.uuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const newLyricsToInsert = payload.lyrics?.map((lyric, idx) => ({
      seq: ++idx,
      videoId,
      ...lyric,
    }))

    if (newLyricsToInsert) {
      await this.lyricRepository.save(newLyricsToInsert, videoId)
    }

    return video
  }
}
