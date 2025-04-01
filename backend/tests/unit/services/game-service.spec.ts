import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import Sinon, { spy, stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { IVideoPlayCountRepository } from '#infra/db/repository/interfaces/video-play-count-repository'
import { GameService } from '#services/game-service'
import { IGameService } from '#services/interfaces/game-service'
import { mockGameModesData } from '#tests/__mocks__/stubs/mock-game-stub'
import { mockLyricRepository } from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'

const mockVideoPlayCountRepositoryStub = (): IVideoPlayCountRepository => ({
  increment: (videoId: number) => Promise.resolve(),
})

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

test.group('GameService', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return game modes with success', async ({ expect }) => {
    const { sut } = makeSut()

    const lyrics = []
    for (let i = 1; i <= 50; i++) {
      lyrics.push({
        seq: i,
        line: faker.lorem.sentence(5),
        startTime: '00:00.00',
        endTime: '00:00.10',
      })
    }

    stub(mockLyricRepository, 'find').resolves(lyrics)
    const response = await sut.getModes(faker.string.uuid())
    const { totalWords, beginner, intermediate, advanced, specialist } = response

    const { beginnerPercent, intermediatePercent, advancedPercent } = mockGameModesData
    const mockTotalWords = lyrics.reduce((acc, lyric) => {
      return acc + lyric.line.split(' ').length
    }, 0)

    expect(totalWords).toBe(mockTotalWords)
    expect(beginner).toEqual({
      percent: beginnerPercent,
      totalFillWords: Number(((totalWords * beginnerPercent) / 100).toFixed()),
    })
    expect(intermediate).toEqual({
      percent: intermediatePercent,
      totalFillWords: Number(((totalWords * intermediatePercent) / 100).toFixed()),
    })
    expect(advanced).toEqual({
      percent: advancedPercent,
      totalFillWords: Number(((totalWords * advancedPercent) / 100).toFixed()),
    })
    expect(specialist).toEqual({
      percent: 100,
      totalFillWords: Number(totalWords.toFixed()),
    })
  })

  test('return an error if video not found', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoRepository, 'getVideoId').resolves(null)
    const response = sut.getModes('any_uuid')

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('call ILyricRepository find with correct values', async ({ expect }) => {
    const { sut } = makeSut()
    const findSpy = spy(mockLyricRepository, 'find')

    await sut.getModes('any_uuid')

    expect(findSpy.calledWith(1)).toBeTruthy()
  })

  test('call IVideoRepository find with correct values', async ({ expect }) => {
    const { sut } = makeSut()
    const findSpy = spy(mockVideoRepository, 'getVideoId')

    await sut.getModes('any_uuid')

    expect(findSpy.calledWith('any_uuid')).toBeTruthy()
  })

  test('return success if a video was played', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.play(faker.string.uuid())

    expect(response).toBeFalsy()
  })

  test('return fail if a video not exists', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoRepository, 'getVideoId').resolves(null)
    const response = sut.play(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('call IVideoRepository.getVideoId with correct values', async ({ expect }) => {
    const { sut } = makeSut()
    const uuid = faker.string.uuid()
    const getVideoIdStub = Sinon.spy(mockVideoRepository, 'getVideoId')
    await sut.play(uuid)

    expect(getVideoIdStub.calledWith(uuid)).toBeTruthy()
  })

  test('call IVideoPlayCountRepository.increment with correct values', async ({ expect }) => {
    const { sut, videoPlayCountRepositoryStub } = makeSut()
    const uuid = faker.string.uuid()
    const incrementStub = Sinon.spy(videoPlayCountRepositoryStub, 'increment')
    await sut.play(uuid)

    expect(incrementStub.calledWith(1)).toBeTruthy()
  })
})
