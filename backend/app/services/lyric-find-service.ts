import { inject } from '@adonisjs/core'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { LyricFindResponse } from '#models/lyric-metadata'
import { LyricFindProtocolService } from '#services/_protocols/lyric-find-protocol-service'

@inject()
export class LyricFindService implements LyricFindProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly lyricRepository: LyricRepository
  ) {}

  async find(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    return await this.lyricRepository.find(videoId)
  }
}
