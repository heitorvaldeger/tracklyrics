import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { FavoritePostgresRepository } from '#infra/db/repository/postgres/favorite-postgres-repository'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'

const makeSut = async () => {
  const { fakeVideo, fakeGenre, fakeLanguage, fakeUser, fakeFavorite } = await mockLucidEntity()

  const sut = new FavoritePostgresRepository()

  return { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser, fakeFavorite }
}

test.group('FavoritePostgresRepository', () => {
  test('it must return true if video added or updated to favorite on success', async ({
    expect,
  }) => {
    const { sut, fakeVideo } = await makeSut()

    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, faker.string.uuid())
    expect(added).toBeTruthy()
  })

  test('it must return true if favorite already exists', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    const favoriteUuid = faker.string.uuid()
    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, favoriteUuid)
    expect(added).toBeTruthy()
  })

  test('it must return true if video removed to favorite on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    const response = await sut.removeFavorite(fakeVideo.id, fakeVideo.userId)
    expect(response).toBeTruthy()
  })

  test('it must return a list favorite videos by user', async ({ expect }) => {
    const { sut, fakeVideo, fakeGenre, fakeLanguage, fakeUser } = await makeSut()
    const entity2 = await mockLucidEntity()
    const entity3 = await mockLucidEntity()
    const entity4 = await mockLucidEntity()

    await FavoriteLucid.create({
      videoId: entity2.fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })
    await FavoriteLucid.create({
      videoId: entity3.fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })
    await FavoriteLucid.create({
      videoId: entity4.fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })

    const response = await sut.findFavoritesByUser(fakeVideo.userId)
    expect(response.length).toBe(4)
    expect(response[0]).toEqual({
      title: fakeVideo.title,
      artist: fakeVideo.artist,
      uuid: fakeVideo.uuid,
      releaseYear: fakeVideo.releaseYear,
      linkYoutube: fakeVideo.linkYoutube,
      qtyViews: fakeVideo.qtyViews,
      language: fakeLanguage.name,
      genre: fakeGenre.name,
      username: fakeUser.username,
    })
  })
})
