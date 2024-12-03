import { test } from '@japa/runner'
import Favorite from '#models/lucid-orm/favorite'
import { faker } from '@faker-js/faker'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { FavoritePostgresRepository } from '#repository/postgres-repository/favorite-postgres-repository'

const makeSut = async () => {
  const { fakeVideo } = await mockVideoEntity()

  const sut = new FavoritePostgresRepository()

  return { sut, fakeVideo }
}

test.group('FavoritePostgresRepository', () => {
  test('should return true if video added or updated to favorite on success', async ({
    expect,
  }) => {
    const { sut, fakeVideo } = await makeSut()

    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, faker.string.uuid())
    expect(added).toBeTruthy()
  })

  test('should return true if favorite already exists', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    const favoriteUuid = faker.string.uuid()
    await Favorite.create({
      videoId: fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: favoriteUuid,
    })

    const added = await sut.addFavorite(fakeVideo.id, fakeVideo.userId, favoriteUuid)
    expect(added).toBeTruthy()
  })

  test('should return true if video removed to favorite on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()

    await Favorite.create({
      videoId: fakeVideo.id,
      userId: fakeVideo.userId,
      uuid: faker.string.uuid(),
    })

    const response = await sut.removeFavorite(fakeVideo.id, fakeVideo.userId)
    expect(response).toBeTruthy()
  })
})
