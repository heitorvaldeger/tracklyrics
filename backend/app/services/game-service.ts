import { inject } from '@adonisjs/core'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { VideoPlayCountRepository } from '#infra/db/repository/_protocols/video-play-count-repository'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'

import { GameProtocolService } from './_protocols/game-protocol-service.js'

@inject()
export class GameService implements GameProtocolService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly lyricRepository: LyricRepository,
    private readonly videoPlayCountRepository: VideoPlayCountRepository
  ) {}

  async getModes(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const lyrics = await this.lyricRepository.find(videoId)
    const totalWords = lyrics.reduce((acc, value) => {
      return acc + value.line.split(' ').length
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

    return modes
  }

  async play(videoUuid: string) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    await this.videoPlayCountRepository.increment(videoId)
  }
}
