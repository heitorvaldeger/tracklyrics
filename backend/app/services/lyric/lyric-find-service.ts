import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { LyricFindResponse } from '#models/lyric-metadata'
import { LyricFindProtocolService } from '#services/_protocols/lyric/lyric-find-protocol-service'

@inject()
export class LyricFindService implements LyricFindProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly lyricRepository: LyricRepository
  ) {}

  async find(videoUuid: string): Promise<MethodResponse<LyricFindResponse[]>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const lyrics = await this.lyricRepository.find(videoId)
    return createSuccessResponse(lyrics)
  }
}
