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
import { VideoUpdateProtocolService } from '#services/_protocols/video-update-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video-user-logged-protocol-service'

@inject()
export class VideoUpdateService implements VideoUpdateProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly authStrategy: Auth,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService,
    private readonly genreRepository: GenreRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly lyricRepository: LyricRepository
  ) {}

  async update(payload: VideoUpdateProtocolService.Params, uuid: string) {
    const { lyrics, linkYoutube, genreId, languageId, ...rest } = payload

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

    const updated = await this.videoRepository.update(
      {
        ...rest,
        languageId,
        genreId,
        userId: this.authStrategy.getUserId(),
      },
      uuid
    )

    const videoId = await this.videoRepository.getVideoId(uuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const newLyrics = lyrics?.map((lyric, idx) => ({
      seq: ++idx,
      videoId,
      ...lyric,
    }))

    if (newLyrics && newLyrics?.length > 0) {
      await this.lyricRepository.save(newLyrics)
    }

    return updated
  }
}
