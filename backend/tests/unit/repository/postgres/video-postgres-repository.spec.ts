import _ from 'lodash'
import { test } from '@japa/runner'
import { VideoPostgresRepository } from '#repository/postgres-repository/video-postgres-repository'
import Video from '#models/video-model/video-lucid'
import Favorite from '#models/lucid-orm/favorite'
import { stub } from 'sinon'
import db from '@adonisjs/lucid/services/db'
import VideoLucid from '#models/video-model/video-lucid'
import UserLucid from '#models/user-model/user-lucid'
import { NilUUID } from '#tests/utils/NilUUID'
import { faker } from '@faker-js/faker'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'

const fieldsToOmit = ['userId', 'languageId', 'genreId', 'id']
export const makeFake = async () => {
  const { fakeGenre, fakeLanguage, fakeUser, fakeVideo } = await mockVideoEntity()

  const fakeFullVideo = Object.assign({}, fakeVideo.serialize() as Video, {
    genre: fakeGenre.name,
    language: fakeLanguage.name,
    username: fakeUser.username,
    id: fakeVideo.id,
  })

  return {
    fakeGenre,
    fakeLanguage,
    fakeUser,
    fakeVideo,
    fakeFullVideo,
  }
}

const makeSut = async () => {
  const { fakeUser, fakeFullVideo } = await makeFake()

  const sut = new VideoPostgresRepository()

  return { sut, fakeFullVideo, fakeUserUuid: fakeUser.uuid }
}

test.group('VideoPostgresRepository', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
  })

  test('should return a list videos on findBy if params provided is empty', async ({ expect }) => {
    const { sut } = await makeSut()

    const videos = await sut.findBy({})

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('should return a list videos on findBy if genreId param is provided', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()

    const videos = await sut.findBy({ genreId: fakeFullVideo.genreId })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos).toEqual([_.omit(fakeFullVideo, fieldsToOmit)])
  })

  test('should return a list videos on findBy if languageId param is provided', async ({
    expect,
  }) => {
    const { sut, fakeFullVideo } = await makeSut()

    const videos = await sut.findBy({ languageId: fakeFullVideo.languageId })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos).toEqual([_.omit(fakeFullVideo, fieldsToOmit)])
  })

  test('should returns a list videos on findBy if userUuid param is provided', async ({
    expect,
  }) => {
    const { sut, fakeFullVideo, fakeUserUuid } = await makeSut()

    const videos = await sut.findBy({ userUuid: fakeUserUuid })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos).toEqual([_.omit(fakeFullVideo, fieldsToOmit)])

    const firstItem = videos[0]
    expect(firstItem.username).toEqual(fakeFullVideo.username)
  })

  test('should return a video on find', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()
    const video = await sut.find(fakeFullVideo.uuid)

    expect(video).toEqual(_.omit(fakeFullVideo, fieldsToOmit))
  })

  test('should return null on find if uuid param is invalid', async ({ expect }) => {
    const { sut } = await makeSut()
    const video = await sut.find(NilUUID)

    expect(video).toBeFalsy()
  })

  test('should returns true if link youtube already exists', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()
    const hasYoutubeLink = await sut.hasYoutubeLink(fakeFullVideo.linkYoutube)

    expect(hasYoutubeLink).toBeTruthy()
  })

  test('should return a list videos on findBy if param provided not exists in filter', async ({
    expect,
  }) => {
    const { sut } = await makeSut()

    const param: any = {
      any_param: 'any_value',
    }
    const videos = await sut.findBy(param)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('should return a list videos on findBy if any param value provided is null', async ({
    expect,
  }) => {
    const { sut } = await makeSut()

    const param: any = {
      language_id: null,
    }
    const videos = await sut.findBy(param)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('should return success if a video deleted on success', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()
    const isSuccess = await sut.delete(fakeFullVideo.uuid)

    expect(isSuccess).toBeTruthy()
  })

  test('should return success if a video updated on success', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()

    const video = await sut.update(
      {
        title: 'other_title',
      },
      fakeFullVideo.uuid
    )

    expect(video).toBeTruthy()
  })

  test('should return success if a video created on success', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()
    const fakePayload = {
      ..._.omit(fakeFullVideo, ['language', 'genre', 'username', 'id']),
      uuid: faker.string.uuid(),
    }
    const newVideo = await sut.create(fakePayload)

    expect(newVideo).toEqual(fakePayload)
  })

  test('should throws an error on create', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()
    const fakePayload = {
      ..._.omit(fakeFullVideo, ['language', 'genre', 'username', 'id']),
      uuid: faker.string.uuid(),
    }

    stub(db, 'from')
      .withArgs('videos')
      .returns({
        where: stub().returnsThis(),
        select: stub().returnsThis(),
        knexQuery: stub(db.knexQuery()),
        insert: stub().returnsThis(),
        first: stub().resolves(null),
      } as any)

    const response = sut.create(fakePayload)
    expect(response).rejects.toThrowError(
      new Error(
        'An error occurred during the video creation process. Please try again or contact support if the issue persists.'
      )
    )
  })

  test('should return a video id if videoUuid valid is provided', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()

    const videoId = await sut.getVideoId(fakeFullVideo.uuid)
    expect(videoId).toBe(fakeFullVideo.id)
  })

  test('should return a user id if userUuid valid is provided', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()

    const userId = await sut.getUserId(fakeFullVideo.uuid)
    expect(userId).toBe(fakeFullVideo.userId)
  })

  test('should return null if videoUuid invalid is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const videoId = await sut.getVideoId(NilUUID)
    expect(videoId).toBeFalsy()
  })

  test('should return null if userUuid invalid is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const userId = await sut.getUserId(NilUUID)
    expect(userId).toBeFalsy()
  })
})
