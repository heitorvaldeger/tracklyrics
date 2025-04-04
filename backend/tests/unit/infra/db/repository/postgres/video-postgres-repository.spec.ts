import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import { VideoPostgresRepository } from '#infra/db/repository/postgres/video-postgres-repository'
import { Lyric } from '#models/lyric'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

const createData = async () => {
  const { fakeVideo, fakeUser, fakeLanguage, fakeGenre } = await mockAllTables()

  return { fakeVideo, fakeUser, fakeLanguage, fakeGenre }
}
const makeSut = async () => {
  const sut = new VideoPostgresRepository()

  return { sut }
}

test.group('VideoPostgresRepository', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a list videos on findBy if params provided is empty', async ({ expect }) => {
    await createData()

    const { sut } = await makeSut()

    const videos = await sut.findBy({})

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('return a list videos on findBy if genreId param is provided', async ({ expect }) => {
    const { fakeVideo, fakeUser } = await createData()
    const { sut } = await makeSut()

    const videos = await sut.findBy({ genreId: fakeVideo.genreId })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos[0].username).toBe(fakeUser.username)
    expect(videos[0].title).toBe(fakeVideo.title)
    expect(videos[0].artist).toBe(fakeVideo.artist)
    expect(videos[0].linkYoutube).toBe(fakeVideo.linkYoutube)
  })

  test('return a list videos on findBy if languageId param is provided', async ({ expect }) => {
    const { fakeVideo, fakeLanguage } = await createData()
    const { sut } = await makeSut()

    const videos = await sut.findBy({ languageId: fakeLanguage.id })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos[0].language).toBe(fakeLanguage.name)
    expect(videos[0].title).toBe(fakeVideo.title)
    expect(videos[0].artist).toBe(fakeVideo.artist)
  })

  test('return a list videos on findBy if userUuid param is provided', async ({ expect }) => {
    const { fakeVideo, fakeUser } = await createData()
    const { sut } = await makeSut()

    const videos = await sut.findBy({ userUuid: fakeUser.uuid })

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
    expect(videos[0].username).toEqual(fakeUser.username)
    expect(videos[0].title).toBe(fakeVideo.title)
    expect(videos[0].artist).toBe(fakeVideo.artist)
  })

  test('return a list videos on findBy if param provided not exists in filter', async ({
    expect,
  }) => {
    await createData()

    const { sut } = await makeSut()

    const param: any = {
      any_param: 'any_value',
    }
    const videos = await sut.findBy(param)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('return a list videos on findBy if any param value provided is null', async ({ expect }) => {
    await createData()

    const { sut } = await makeSut()

    const param: any = {
      language_id: null,
    }
    const videos = await sut.findBy(param)

    expect(Array.isArray(videos)).toBeTruthy()
    expect(videos.length).toBe(1)
  })

  test('return a video on find', async ({ expect }) => {
    const { fakeVideo, fakeUser } = await createData()
    const { sut } = await makeSut()

    const video = await sut.find(fakeVideo.uuid)

    expect(video).toBeTruthy()
    expect(video?.username).toEqual(fakeUser.username)
    expect(video?.title).toBe(fakeVideo.title)
    expect(video?.artist).toBe(fakeVideo.artist)
    expect(video?.linkYoutube).toBe(fakeVideo.linkYoutube)
  })

  test('return a video on find with is_favorite false', async ({ expect }) => {
    const { fakeVideo, fakeUser } = await createData()

    const { sut } = await makeSut()
    const video = await sut.find(fakeVideo.uuid)

    expect(video).toBeTruthy()
    expect(video?.username).toEqual(fakeUser.username)
    expect(video?.title).toBe(fakeVideo.title)
    expect(video?.artist).toBe(fakeVideo.artist)
    expect(video?.linkYoutube).toBe(fakeVideo.linkYoutube)
  })

  test('return null on find if uuid param is invalid', async ({ expect }) => {
    const { sut } = await makeSut()
    const video = await sut.find(NilUUID)

    expect(video).toBeFalsy()
  })

  test('return true if link youtube already exists', async ({ expect }) => {
    const { fakeVideo } = await createData()
    const { sut } = await makeSut()
    const hasYoutubeLink = await sut.hasYoutubeLink(fakeVideo.linkYoutube)

    expect(hasYoutubeLink).toBeTruthy()
  })

  test('return success if a video deleted on success with favorites/lyrics/play_counts', async ({
    expect,
  }) => {
    const { fakeVideo } = await createData()

    const { sut } = await makeSut()
    const isDeleted = await sut.delete(fakeVideo.uuid)

    const favorites = await db.from('favorites').where('video_id', fakeVideo.id).select()
    const lyrics = await Lyric.findManyBy('videoId', fakeVideo.id)
    const plays = await db.from('video_play_counts').where('video_id', fakeVideo.id).select()

    expect(isDeleted).toBeTruthy()
    expect(favorites.length).toBe(0)
    expect(lyrics.length).toBe(0)
    expect(plays.length).toBe(0)
  })

  test('return success if a video updated on success', async ({ expect }) => {
    const { fakeVideo } = await createData()
    const { sut } = await makeSut()

    const video = await sut.update(
      {
        ...fakeVideo,
        title: 'other_title',
      },
      fakeVideo.uuid
    )

    expect(video).toBeTruthy()
  })

  test('return success if a video created on success', async ({ expect }) => {
    const { fakeVideo, fakeUser, fakeLanguage, fakeGenre } = await createData()

    const { sut } = await makeSut()
    const fakePayload = {
      ..._.omit(fakeVideo, ['userId', 'languageId', 'genreId', 'id']),
      uuid: faker.string.uuid(),
      genreId: fakeGenre.id,
      languageId: fakeLanguage.id,
      userId: fakeUser.id,
    }

    const newVideo = await sut.create(fakePayload)

    expect(newVideo).toEqual(fakePayload)
  })

  test('return a video id if videoUuid valid is provided', async ({ expect }) => {
    const { fakeVideo } = await createData()
    const { sut } = await makeSut()

    const videoId = await sut.getVideoId(fakeVideo.uuid)
    expect(videoId).toBe(fakeVideo.id)
  })

  test('return a user id if userUuid valid is provided', async ({ expect }) => {
    const { fakeVideo } = await createData()
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

  test("return null if youtube URL doesn't exists", async ({ expect }) => {
    const { sut } = await makeSut()

    const videoUuid = await sut.getVideoUuidByYoutubeURL('any_youtube_url')
    expect(videoUuid).toBeFalsy()
  })

  test('return video uuid if youtube URL exists', async ({ expect }) => {
    const { fakeVideo } = await createData()

    const { sut } = await makeSut()

    const videoUuid = await sut.getVideoUuidByYoutubeURL(fakeVideo.linkYoutube)
    expect(videoUuid).toBe(fakeVideo.uuid)
  })
})
