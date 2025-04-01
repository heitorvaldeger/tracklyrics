import { inject } from '@adonisjs/core'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { ILyricRepository } from '#infra/db/repository/interfaces/lyric-repository'
import { IVideoPlayCountRepository } from '#infra/db/repository/interfaces/video-play-count-repository'
import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'

import { IGameService } from './interfaces/game-service.js'

@inject()
export class GameService implements IGameService {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly lyricRepository: ILyricRepository,
    private readonly videoPlayCountRepository: IVideoPlayCountRepository
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
