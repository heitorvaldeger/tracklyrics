import { inject } from '@adonisjs/core'

import { GameModesHash } from '#enums/game-modes-hash'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { ILyricRepository } from '#infra/db/repository/interfaces/lyric-repository'
import { IVideoPlayCountRepository } from '#infra/db/repository/interfaces/video-play-count-repository'
import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'
import { parseTimestamp, shuffleArray } from '#utils/index'

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
        id: GameModesHash.BEGINNER,
      },
      intermediate: {
        percent: intermediateModePercent,
        totalFillWords: Number(((totalWords * intermediateModePercent) / 100).toFixed()),
        id: GameModesHash.INTERMEDIATE,
      },
      advanced: {
        percent: advancedModePercent,
        totalFillWords: Number(((totalWords * advancedModePercent) / 100).toFixed()),
        id: GameModesHash.ADVANCED,
      },
      specialist: {
        percent: 100,
        totalFillWords: Number(totalWords.toFixed()),
        id: GameModesHash.SPECIALIST,
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

  async getGame(videoUuid: string, mode: GameModesHash) {
    const videoId = await this.videoRepository.getVideoId(videoUuid)
    if (!videoId) {
      throw new VideoNotFoundException()
    }

    const lyrics = await this.lyricRepository.find(videoId)
    if (!lyrics.length) return []

    const totalWords = lyrics.reduce((acc, value) => {
      return acc + value.line.split(' ').length
    }, 0)

    const beginnerModePercent = 15
    const intermediateModePercent = 30
    const advancedModePercent = 60

    let totalFillWords = 0
    switch (mode) {
      case GameModesHash.BEGINNER:
        totalFillWords = Number(((totalWords * beginnerModePercent) / 100).toFixed())
        break
      case GameModesHash.INTERMEDIATE:
        totalFillWords = Number(((totalWords * intermediateModePercent) / 100).toFixed())
        break
      case GameModesHash.ADVANCED:
        totalFillWords = Number(((totalWords * advancedModePercent) / 100).toFixed())
        break
      case GameModesHash.SPECIALIST:
        totalFillWords = Number(totalWords.toFixed())
        break
    }

    const allWordPositions = lyrics.flatMap(({ line, seq }, lineIndex) =>
      line.split(/\s+/).map((_, wordIndex) => ({ lineIndex, wordIndex, seq }))
    )

    const positionsToMask = shuffleArray(allWordPositions).slice(0, totalFillWords)

    const maskMap: Map<number, Set<Number>> = positionsToMask.reduce(
      (acc, { lineIndex, wordIndex }) => {
        const set = acc.get(lineIndex) ?? new Set()
        set.add(wordIndex)
        acc.set(lineIndex, set)
        return acc
      },
      new Map()
    )

    return lyrics.map((lyric, i) => {
      const startTimeMs = parseTimestamp(lyric.startTime)
      const endTimeMs = parseTimestamp(lyric.endTime)

      let newWords: {
        word: string
        correctWord: string
        isGap: boolean
      }[] = []
      if (maskMap.has(i)) {
        const words = lyric.line.split(/\s+/)
        newWords = words.map((word, wi) => {
          const newWord = maskMap.get(i)?.has(wi)
            ? word
                .split('')
                .map((char) => (/[a-zA-Z0-9]/.test(char) ? '•' : char))
                .join('')
            : word

          return {
            word: newWord,
            correctWord: word,
            isGap: true,
          }
        })
      }
      return {
        seq: lyric.seq,
        line: lyric.line,
        lineMasked: newWords.map((nw) => nw.word).join(' '),
        startTimeMs,
        endTimeMs,
        words: !newWords.length ? null : newWords,
      }
    })
  }
}
