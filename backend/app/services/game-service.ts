import { inject } from '@adonisjs/core'

import { GameModesHash } from '#enums/game-modes-hash'
import { GameModesPercent } from '#enums/game-modes-percent'
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

    const modes = {
      totalWords,
      beginner: {
        percent: GameModesPercent.BEGINNER,
        gaps: this.getGapsByMode(totalWords, GameModesPercent.BEGINNER),
        id: GameModesHash.BEGINNER,
      },
      intermediate: {
        percent: GameModesPercent.INTERMEDIATE,
        gaps: this.getGapsByMode(totalWords, GameModesPercent.INTERMEDIATE),
        id: GameModesHash.INTERMEDIATE,
      },
      advanced: {
        percent: GameModesPercent.ADVANCED,
        gaps: this.getGapsByMode(totalWords, GameModesPercent.ADVANCED),
        id: GameModesHash.ADVANCED,
      },
      specialist: {
        percent: GameModesPercent.SPECIALIST,
        gaps: this.getGapsByMode(totalWords, GameModesPercent.SPECIALIST),
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
    if (!lyrics.length) {
      return {
        gaps: 0,
        lyrics: [],
      }
    }

    const totalWords = lyrics.reduce((acc, value) => {
      return acc + value.line.split(' ').length
    }, 0)

    let gaps = 0
    switch (mode) {
      case GameModesHash.BEGINNER:
        gaps = this.getGapsByMode(totalWords, GameModesPercent.BEGINNER)
        break
      case GameModesHash.INTERMEDIATE:
        gaps = this.getGapsByMode(totalWords, GameModesPercent.INTERMEDIATE)
        break
      case GameModesHash.ADVANCED:
        gaps = this.getGapsByMode(totalWords, GameModesPercent.ADVANCED)
        break
      case GameModesHash.SPECIALIST:
        gaps = this.getGapsByMode(totalWords, GameModesPercent.SPECIALIST)
        break
    }

    const allWordPositions = lyrics.flatMap(({ line, seq }, lineIndex) =>
      line.split(/\s+/).map((_, wordIndex) => ({ lineIndex, wordIndex, seq }))
    )

    const positionsToMask = shuffleArray(allWordPositions).slice(0, gaps)

    const maskMap: Map<number, Set<Number>> = positionsToMask.reduce(
      (acc, { lineIndex, wordIndex }) => {
        const set = acc.get(lineIndex) ?? new Set()
        set.add(wordIndex)
        acc.set(lineIndex, set)
        return acc
      },
      new Map()
    )

    const lyricsWithGaps = lyrics.map((lyric, i) => {
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

    return {
      lyrics: lyricsWithGaps,
      gaps,
    }
  }

  private getGapsByMode(totalWords: number, mode: GameModesPercent) {
    return Number(((totalWords * mode) / 100).toFixed())
  }
}
