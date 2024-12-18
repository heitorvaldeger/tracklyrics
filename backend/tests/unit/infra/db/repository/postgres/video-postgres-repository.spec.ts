import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import { VideoPostgresRepository } from '#infra/db/repository/postgres/video-postgres-repository'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import { LyricLucid } from '#models/lyric-model/lyric-lucid'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import VideoPlayCountLucid from '#models/video-play-count/video-play-count-lucid'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'
import { NilUUID } from '#tests/utils/NilUUID'

const makeSut = async () => {
  const sut = new VideoPostgresRepository()

  return { sut }
}

test.group('VideoPostgresRepository', (group) => {
  let fakeGenre: GenreLucid
  let fakeLanguage: LanguageLucid
  let fakeUser: UserLucid
  let fakeVideo: VideoLucid
  let fakeVideoToCreate: any
  group.each.setup(async () => {
    let lucidEntity = await mockLucidEntity()
    fakeGenre = lucidEntity.fakeGenre
    fakeLanguage = lucidEntity.fakeLanguage
    fakeUser = lucidEntity.fakeUser
    fakeVideo = lucidEntity.fakeVideo
    fakeVideoToCreate = {
      ...fakeVideo.serialize({
        fields: {
          omit: ['userId', 'languageId', 'genreId'],
        },
      }),
    }
  })

  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a list videos on findBy if params provided is empty', async ({ expect }) => {
    const { sut } = await makeSut()

    const videos = await sut.findBy({})

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('return a list videos on findBy if genreId param is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const videos = await sut.findBy({ genreId: fakeGenre.id })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos[0].username).toBe(fakeUser.username)
    expect(videos[0].title).toBe(fakeVideo.title)
    expect(videos[0].artist).toBe(fakeVideo.artist)
  })

  test('return a list videos on findBy if languageId param is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const videos = await sut.findBy({ languageId: fakeLanguage.id })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos[0].language).toBe(fakeLanguage.name)
    expect(videos[0].title).toBe(fakeVideo.title)
    expect(videos[0].artist).toBe(fakeVideo.artist)
  })

  test('returns a list videos on findBy if userUuid param is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const videos = await sut.findBy({ userUuid: fakeUser.uuid })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos[0].username).toEqual(fakeUser.username)
    expect(videos[0].title).toBe(fakeVideo.title)
    expect(videos[0].artist).toBe(fakeVideo.artist)
  })

  test('return a video on find', async ({ expect }) => {
    const { sut } = await makeSut()
    const video = await sut.find(fakeVideo.uuid)

    expect(video).toBeTruthy()
    expect(video?.username).toEqual(fakeUser.username)
    expect(video?.title).toBe(fakeVideo.title)
    expect(video?.artist).toBe(fakeVideo.artist)
  })

  test('return null on find if uuid param is invalid', async ({ expect }) => {
    const { sut } = await makeSut()
    const video = await sut.find(NilUUID)

    expect(video).toBeFalsy()
  })

  test('returns true if link youtube already exists', async ({ expect }) => {
    const { sut } = await makeSut()
    const hasYoutubeLink = await sut.hasYoutubeLink(fakeVideo.linkYoutube)

    expect(hasYoutubeLink).toBeTruthy()
  })

  test('return a list videos on findBy if param provided not exists in filter', async ({
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

  test('return a list videos on findBy if any param value provided is null', async ({ expect }) => {
    const { sut } = await makeSut()

    const param: any = {
      language_id: null,
    }
    const videos = await sut.findBy(param)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('return success if a video deleted on success', async ({ expect }) => {
    const { sut } = await makeSut()
    const isSuccess = await sut.delete(fakeVideo.uuid)

    expect(isSuccess).toBeTruthy()
  })

  test('return success if a video deleted on success with favorites/lyrics/play_counts', async ({
    expect,
  }) => {
    const { sut } = await makeSut()
    const isDeleted = await sut.delete(fakeVideo.uuid)
    const favoritesCount = await FavoriteLucid.query().where('videoId', fakeVideo.id).select()
    const lyricsCount = await LyricLucid.query().where('videoId', fakeVideo.id).select()
    const videoPlayCountLucid = await VideoPlayCountLucid.query()
      .where('videoId', fakeVideo.id)
      .select()

    expect(isDeleted).toBeTruthy()
    expect(favoritesCount.length).toBe(0)
    expect(lyricsCount.length).toBe(0)
    expect(videoPlayCountLucid.length).toBe(0)
  })

  test('return success if a video updated on success', async ({ expect }) => {
    const { sut } = await makeSut()

    const video = await sut.update(
      {
        title: 'other_title',
      },
      fakeVideo.uuid
    )

    expect(video).toBeTruthy()
  })

  test('return success if a video created on success', async ({ expect }) => {
    const { sut } = await makeSut()
    const fakePayload = {
      ...fakeVideoToCreate,
      uuid: faker.string.uuid(),
      genreId: fakeGenre.id,
      languageId: fakeLanguage.id,
      userId: fakeUser.id,
    }
    const newVideo = await sut.create(fakePayload)

    expect(newVideo).toEqual(fakePayload)
  })

  test('throws an error on create', async ({ expect }) => {
    const { sut } = await makeSut()
    const fakePayload = {
      ...fakeVideoToCreate,
      uuid: faker.string.uuid(),
      genreId: fakeGenre.id,
      languageId: fakeLanguage.id,
      userId: fakeUser.id,
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

  test('return a video id if videoUuid valid is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const videoId = await sut.getVideoId(fakeVideo.uuid)
    expect(videoId).toBe(fakeVideo.id)
  })

  test('return a user id if userUuid valid is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const userId = await sut.getUserId(fakeVideo.uuid)
    expect(userId).toBe(fakeVideo.userId)
  })

  test('return null if videoUuid invalid is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const videoId = await sut.getVideoId(NilUUID)
    expect(videoId).toBeFalsy()
  })

  test('return null if userUuid invalid is provided', async ({ expect }) => {
    const { sut } = await makeSut()

    const userId = await sut.getUserId(NilUUID)
    expect(userId).toBeFalsy()
  })
})
