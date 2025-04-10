import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { GameModesHash } from '#enums/game-modes-hash'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricResponseWithoutIds } from '#infra/db/repository/interfaces/lyric-repository'
import { IVideoPlayCountRepository } from '#infra/db/repository/interfaces/video-play-count-repository'
import { GameService } from '#services/game-service'
import { IGameService } from '#services/interfaces/game-service'
import { mockLyricRepository } from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'
import { parseTimestamp } from '#utils/index'

const mockVideoPlayCountRepositoryStub = (): IVideoPlayCountRepository => ({
  increment: (videoId: number) => Promise.resolve(),
})

const makeTotalWordsMasked = (response: IGameService.GameResponse[]) => {
  return response.reduce((acc, v) => {
    const countWordMasked = v.lineMasked.split(/\s+/).filter((item) => item.includes('•')).length
    acc += countWordMasked

    return acc
  }, 0)
}

const makeSut = () => {
  const videoPlayCountRepositoryStub = mockVideoPlayCountRepositoryStub()
  const sut = new GameService(
    mockVideoRepository,
    mockLyricRepository,
    videoPlayCountRepositoryStub
  )

  return {
    sut,
    videoPlayCountRepositoryStub,
  }
}

test.group('GameService.getGame', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  let lyrics: LyricResponseWithoutIds[] = []
  let totalWords: number = 0
  let lines: string[] = []
  let times: {
    startTimeMs: number
    endTimeMs: number
  }[] = []

  group.each.setup((t) => {
    lyrics = Array.from({ length: 50 }).map((_, i) => ({
      seq: i,
      line: faker.lorem.sentence(5),
      startTime: '00:00.00',
      endTime: '00:00.10',
    }))

    lines = lyrics.map((lyric) => lyric.line)
    totalWords = lyrics.reduce((acc, value) => {
      return acc + value.line.split(' ').length
    }, 0)
    times = lyrics.map((lyric) => ({
      startTimeMs: parseTimestamp(lyric.startTime),
      endTimeMs: parseTimestamp(lyric.endTime),
    }))
  })

  group.each.teardown(() => {
    lyrics = []
  })

  test('return an exception if video not found', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockVideoRepository, 'getVideoId').resolves(null)
    const promise = sut.getGame(faker.string.uuid(), GameModesHash.BEGINNER)

    expect(promise).rejects.toEqual(new VideoNotFoundException())
  })

  test('return an empty list of lyrics if no lyrics are found', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockLyricRepository, 'find').resolves([])
    const response = await sut.getGame(faker.string.uuid(), GameModesHash.BEGINNER)

    expect(response).toEqual([])
  })

  test('return an lyrics list for beginner on success', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockLyricRepository, 'find').resolves(lyrics)
    const response = await sut.getGame(faker.string.uuid(), GameModesHash.BEGINNER)

    const totalWordsMasked = makeTotalWordsMasked(response)

    expect(response.map((item) => item.line)).toEqual(lines)
    expect(
      response.map((item) => ({
        startTimeMs: item.startTimeMs,
        endTimeMs: item.endTimeMs,
      }))
    ).toEqual(times)
    expect(totalWordsMasked).toBe(Number(((totalWords * 15) / 100).toFixed()))
  })

  test('return an lyrics list for intermediate on success', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockLyricRepository, 'find').resolves(lyrics)
    const response = await sut.getGame(faker.string.uuid(), GameModesHash.INTERMEDIATE)

    const totalWordsMasked = makeTotalWordsMasked(response)

    expect(response.map((item) => item.line)).toEqual(lines)
    expect(
      response.map((item) => ({
        startTimeMs: item.startTimeMs,
        endTimeMs: item.endTimeMs,
      }))
    ).toEqual(times)
    expect(totalWordsMasked).toBe(Number(((totalWords * 30) / 100).toFixed()))
  })

  test('return an lyrics list for advanced on success', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockLyricRepository, 'find').resolves(lyrics)
    const response = await sut.getGame(faker.string.uuid(), GameModesHash.ADVANCED)

    const totalWordsMasked = makeTotalWordsMasked(response)

    expect(response.map((item) => item.line)).toEqual(lines)
    expect(
      response.map((item) => ({
        startTimeMs: item.startTimeMs,
        endTimeMs: item.endTimeMs,
      }))
    ).toEqual(times)
    expect(totalWordsMasked).toBe(Number(((totalWords * 60) / 100).toFixed()))
  })

  test('return an lyrics list for specialist on success', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockLyricRepository, 'find').resolves(lyrics)
    const response = await sut.getGame(faker.string.uuid(), GameModesHash.SPECIALIST)

    const totalWordsMasked = makeTotalWordsMasked(response)

    expect(response.map((item) => item.line)).toEqual(lines)
    expect(
      response.map((item) => ({
        startTimeMs: item.startTimeMs,
        endTimeMs: item.endTimeMs,
      }))
    ).toEqual(times)
    expect(totalWordsMasked).toBe(Number(totalWords.toFixed()))
  })
})
