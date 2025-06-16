import { inject } from '@adonisjs/core'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { Auth } from '#infra/auth/interfaces/auth'
import { IGenreRepository } from '#infra/db/repository/interfaces/genre-repository'
import { ILanguageRepository } from '#infra/db/repository/interfaces/language-repository'
import { ILyricRepository } from '#infra/db/repository/interfaces/lyric-repository'
import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'
import { IVideoUpdateService } from '#services/interfaces/video-update-service'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'

@inject()
export class VideoUpdateService implements IVideoUpdateService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly auth: Auth,
    private readonly videoCurrentUserService: IVideoUserLoggedService,
    private readonly genreRepository: IGenreRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly lyricRepository: ILyricRepository
  ) {}

  async update(payload: IVideoUpdateService.Params, uuid: string) {
    const { lyrics, linkYoutube, genreId, languageId, ...rest } = payload

    const userId = this.auth.getUserId()!

    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(uuid)) {
      throw new VideoNotFoundException()
    }

    const [genre, language, videoUuid] = await Promise.all([
      this.genreRepository.findById(genreId),
      this.languageRepository.findById(languageId),
      this.videoRepository.getVideoUuidByYoutubeURL(linkYoutube),
    ])

    if (!genre) {
      throw new GenreNotFoundException()
    }

    if (!language) {
      throw new LanguageNotFoundException()
    }

    if (videoUuid && uuid !== videoUuid) {
      throw new YoutubeLinkAlreadyExistsException()
    }

    const videoId = await this.videoRepository.getVideoId(uuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const updated = await this.videoRepository.update(
      {
        ...rest,
        languageId,
        genreId,
        userId,
      },
      uuid
    )

    const newLyrics = lyrics?.map((lyric, idx) => ({
      seq: ++idx,
      videoId,
      ...lyric,
    }))

    if (newLyrics && newLyrics?.length > 0) {
      await this.lyricRepository.save(newLyrics, videoId)
    }

    return updated
  }
}
