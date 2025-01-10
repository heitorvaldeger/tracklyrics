import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { ApplicationError } from '#helpers/types/application-error'
import { MethodResponse } from '#helpers/types/method-response'
import { LyricRepository } from '#infra/db/repository/protocols/lyric-repository'
import { VideoPlayCountRepository } from '#infra/db/repository/protocols/video-play-count-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'

import { GameProtocolService } from './protocols/game-protocol-service.js'

@inject()
export class GameService implements GameProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly lyricRepository: LyricRepository,
    private readonly videoPlayCountRepository: VideoPlayCountRepository
  ) {}

  async getModes(
    videoUuid: string
  ): Promise<MethodResponse<GameProtocolService.ModesResponse | ApplicationError>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    const lyrics = await this.lyricRepository.find(videoId)
    const totalWords = lyrics.reduce((acc, value) => {
      return acc + value.line.length
    }, 0)

    const beginnerModePercent = 15
    const intermediateModePercent = 30
    const advancedModePercent = 60

    const modes = {
      totalWords,
      beginner: {
        percent: beginnerModePercent,
        totalFillWords: Number(((totalWords * beginnerModePercent) / 100).toFixed()),
      },
      intermediate: {
        percent: intermediateModePercent,
        totalFillWords: Number(((totalWords * intermediateModePercent) / 100).toFixed()),
      },
      advanced: {
        percent: advancedModePercent,
        totalFillWords: Number(((totalWords * advancedModePercent) / 100).toFixed()),
      },
      specialist: {
        percent: 100,
        totalFillWords: Number(totalWords.toFixed()),
      },
    }

    return createSuccessResponse(modes)
  }

  async play(videoUuid: string): Promise<MethodResponse<void | ApplicationError>> {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      return createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    }

    await this.videoPlayCountRepository.increment(videoId)
    return createSuccessResponse()
  }
}
