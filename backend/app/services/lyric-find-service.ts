import { inject } from '@adonisjs/core'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { ILyricRepository } from '#infra/db/repository/interfaces/lyric-repository'
import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'
import { ILyricFindService } from '#services/interfaces/lyric-find-service'

@inject()
export class LyricFindService implements ILyricFindService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly lyricRepository: ILyricRepository
  ) {}

  async find(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    return await this.lyricRepository.find(videoId)
  }
}
