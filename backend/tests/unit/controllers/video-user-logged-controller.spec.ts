import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import VideoUserLoggedController from '#controllers/video-user-logged-controller'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import { mockVideoData, mockVideoUserLoggedService } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const sut = new VideoUserLoggedController(mockVideoUserLoggedService)

  return { sut }
}

test.group('VideoUserLoggedController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 if return a video list on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.getVideosByUserLogged()

    expect(httpResponse).toEqual([mockVideoData])
  })

  test('return 401 if user is not authorized', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoUserLoggedService, 'getVideosByUserLogged').rejects(new UnauthorizedException())

    const httpResponse = sut.getVideosByUserLogged()

    expect(httpResponse).rejects.toEqual(new UnauthorizedException())
  })

  test('return 500 if user getVideosByUserLogged throws', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockVideoUserLoggedService, 'getVideosByUserLogged').throws(new Error())

    const httpResponse = sut.getVideosByUserLogged()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
