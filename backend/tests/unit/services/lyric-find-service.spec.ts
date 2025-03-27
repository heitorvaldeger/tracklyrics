import { test } from '@japa/runner'
import Sinon, { stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricFindService } from '#services/lyric-find-service'
import {
  mockLyricFindResponseData,
  mockLyricRepository,
} from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const sut = new LyricFindService(mockVideoRepository, mockLyricRepository)

  return {
    sut,
  }
}

test.group('LyricFindService', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a lyrics list with success', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.find('any_uuid')

    expect(response).toEqual(mockLyricFindResponseData)
  })

  test('return an error if videoId not exist', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoRepository, 'getVideoId').returns(Promise.resolve(null))
    const response = sut.find('any_uuid')

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('call LyricRepository find with correct value', async ({ expect }) => {
    const { sut } = makeSut()
    const findSpy = Sinon.spy(mockLyricRepository, 'find')
    await sut.find('any_uuid')

    expect(findSpy.calledWith(1)).toBeTruthy()
  })

  test('call VideoRepository getVideoId with correct value', async ({ expect }) => {
    const { sut } = makeSut()
    const getVideoIdSpy = Sinon.spy(mockVideoRepository, 'getVideoId')
    await sut.find('any_uuid')

    expect(getVideoIdSpy.calledWith('any_uuid')).toBeTruthy()
  })
})
