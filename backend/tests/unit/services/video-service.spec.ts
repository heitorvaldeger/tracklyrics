import { test } from '@japa/runner'
import { stub } from 'sinon'
import { VideoService } from '#services/VideoService'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'

const fakeVideo = {
  uuid: 'any_uuid',
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'any_link',
  qtyViews: BigInt(0),
  releaseYear: 'any_year',
  language: 'any_language',
  genrer: 'any_genrer',
}

const fakeVideoPayload = {
  uuid: 'any_uuid',
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'any_link',
  qtyViews: BigInt(0),
  releaseYear: 'any_year',
  languageId: 0,
  genrerId: 0,
}

const makeVideoRepositoryStub = () => {
  class GenrerRepositoryStub implements IVideoRepository {
    find(uuid: string): Promise<IVideoResponse | null> {
      return new Promise((resolve) => resolve(fakeVideo))
    }
    findByGenrer(genrerId: number): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve([]))
    }
    findByLanguage(languageId: number): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve([]))
    }
    isVideoAvailable(uuid: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
    delete(uuid: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
    create(payload: any): Promise<void> {
      return new Promise((resolve) => resolve())
    }
    update(payload: any, uuid: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
    findAll(): Promise<any[]> {
      return new Promise((resolve) => resolve([fakeVideo]))
    }
  }

  return new GenrerRepositoryStub()
}
const makeSut = () => {
  const videoRepositoryStub = makeVideoRepositoryStub()
  const sut = new VideoService(videoRepositoryStub)

  return { sut, videoRepositoryStub }
}

test.group('VideoService', () => {
  test('should returns a list of videos with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(createSuccessResponse([fakeVideo]))
  })

  test('should returns a video return on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.find('any_uuid')

    expect(httpResponse).toEqual(createSuccessResponse(fakeVideo))
  })

  test('should returns a error if return on failure', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'find').returns(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.find('any_uuid')

    expect(httpResponse).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should returns a list videos returns on find by genrer', async ({ expect }) => {
    const { sut } = makeSut()
    const httpResponse = await sut.findByGenrer(0)

    expect(httpResponse).toEqual(createSuccessResponse([]))
  })

  test('should returns a list videos returns on find by language', async ({ expect }) => {
    const { sut } = makeSut()
    const httpResponse = await sut.findByLanguage(0)

    expect(httpResponse).toEqual(createSuccessResponse([]))
  })

  test('should return success if a video was delete on success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpResponse = await sut.delete('any_uuid')

    expect(httpResponse).toEqual(createSuccessResponse())
  })

  test('should returns a error if return on failure', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'isVideoAvailable').returns(new Promise((resolve) => resolve(false)))
    const httpResponse = await sut.delete('any_uuid')

    expect(httpResponse).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should return success if a video was update on success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpResponse = await sut.update(fakeVideoPayload, 'any_uuid')

    expect(httpResponse).toEqual(createSuccessResponse())
  })

  test('should returns a error if return on failure', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'isVideoAvailable').returns(new Promise((resolve) => resolve(false)))

    const httpResponse = await sut.update(fakeVideoPayload, 'any_uuid')

    expect(httpResponse).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should return success if a video was create on success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpResponse = await sut.create(fakeVideoPayload)

    expect(httpResponse).toEqual(createSuccessResponse())
  })
})
