import { test } from '@japa/runner'
import Sinon, { stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricFindService } from '#services/lyric-find-service'
import {
  mockLyricFindResponseData,
  mockLyricRepositoryStub,
} from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const lyricRepositoryStub = mockLyricRepositoryStub()
  const sut = new LyricFindService(videoRepositoryStub, lyricRepositoryStub)

  return {
    sut,
    videoRepositoryStub,
    lyricRepositoryStub,
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
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'getVideoId').returns(Promise.resolve(null))
    const response = sut.find('any_uuid')

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('call LyricRepository find with correct value', async ({ expect }) => {
    const { sut, lyricRepositoryStub } = makeSut()
    const lyricInsertSpy = Sinon.spy(lyricRepositoryStub, 'find')
    await sut.find('any_uuid')

    expect(lyricInsertSpy.calledWith(1)).toBeTruthy()
  })

  test('call VideoRepository getVideoId with correct value', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    const lyricInsertSpy = Sinon.spy(videoRepositoryStub, 'getVideoId')
    await sut.find('any_uuid')

    expect(lyricInsertSpy.calledWith('any_uuid')).toBeTruthy()
  })
})
