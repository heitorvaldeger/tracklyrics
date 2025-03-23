import { inject } from '@adonisjs/core'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { LyricSaveResult } from '#models/lyric-save-result'
import { LyricSaveProtocolService } from '#services/_protocols/lyric/lyric-save-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export class LyricSaveService implements LyricSaveProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly videoCurrentUserService: VideoUserLoggedProtocolService,
    private readonly lyricRepository: LyricRepository
  ) {}

  async save(params: LyricSaveProtocolService.LyricParamsToInsert) {
    const { videoUuid, lyrics } = params
    if (await this.videoCurrentUserService.isNotVideoOwnedByUserLogged(videoUuid)) {
      throw new VideoNotFoundException()
    }

    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const newLyricsToInsert = lyrics.map((lyric, idx) => ({
      seq: ++idx,
      videoId,
      ...lyric,
    }))

    return await this.lyricRepository.save(newLyricsToInsert)
  }
}
