import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { FavoritePostgresRepository } from '#infra/db/repository/favorite-repository'
import { Video } from '#models/video'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { mockUser } from '#tests/__mocks__/db/mock-user'
import { toSnakeCase } from '#utils/index'

const makeSut = async () => {
  const { fakeVideo, fakeGenre, fakeLanguage, fakeUser, fakeFavorite } = await mockAllTables()

  const sut = new FavoritePostgresRepository()

  return { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser, fakeFavorite }
}

test.group('FavoritePostgresRepository', () => {
  test('it must return true if video was added to favorite', async ({ expect }) => {
    const { sut, fakeVideo, fakeUser } = await makeSut()

    await (await Video.findBy('uuid', fakeVideo.uuid))?.related('users').detach([fakeUser.id])
    const added = await sut.saveFavorite(fakeVideo.id, fakeUser.id, faker.string.uuid())

    expect(added).toBeTruthy()
  })

  test('it must return true if favorite already exists', async ({ expect }) => {
    const { sut, fakeVideo, fakeFavorite } = await makeSut()

    const updated = await sut.saveFavorite(fakeVideo.id, fakeVideo.userId, fakeFavorite.uuid)
    expect(updated).toBeTruthy()
  })

  test('it must return true if video removed to favorite on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    const response = await sut.removeFavorite(fakeVideo.id, fakeVideo.userId)
    expect(response).toBeTruthy()
  })

  test('it must return a list favorite videos by user', async ({ expect }) => {
    const { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser } = await makeSut()
    const entity2 = await mockAllTables()
    const entity3 = await mockAllTables()
    const entity4 = await mockAllTables()

    await db.table('favorites').multiInsert([
      toSnakeCase({
        videoId: entity2.fakeVideo.id,
        userId: fakeVideo.userId,
        uuid: faker.string.uuid(),
      }),
      toSnakeCase({
        videoId: entity3.fakeVideo.id,
        userId: fakeVideo.userId,
        uuid: faker.string.uuid(),
      }),
      toSnakeCase({
        videoId: entity4.fakeVideo.id,
        userId: fakeVideo.userId,
        uuid: faker.string.uuid(),
      }),
    ])

    const response = await sut.findFavoritesByUser(fakeVideo.userId)
    expect(response.length).toBe(4)
    expect(response[0]).toEqual({
      title: fakeVideo.title,
      artist: fakeVideo.artist,
      uuid: fakeVideo.uuid,
      releaseYear: fakeVideo.releaseYear,
      linkYoutube: fakeVideo.linkYoutube,
      language: fakeLanguage.name,
      genre: fakeGenre.name,
      username: fakeUser.username,
    })
  })

  test('it must return true if video is favorite', async ({ expect }) => {
    const { sut, fakeVideo, fakeUser } = await makeSut()

    const isFavoriteByUser = await sut.isFavoriteByUser(fakeUser.id, fakeVideo.uuid)

    expect(isFavoriteByUser).toBeTruthy()
  })

  test('it must return false if video is not favorite', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    const anotherFakeUser = await mockUser()
    const isFavoriteByUser = await sut.isFavoriteByUser(anotherFakeUser.id, fakeVideo.uuid)

    expect(isFavoriteByUser).toBeFalsy()
  })
})
