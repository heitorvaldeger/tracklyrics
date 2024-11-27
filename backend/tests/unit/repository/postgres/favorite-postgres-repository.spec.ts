import _ from 'lodash'
import { test } from '@japa/runner'
import Video from '#models/video-model/video-lucid'
import Favorite from '#models/lucid-orm/favorite'
import VideoLucid from '#models/video-model/video-lucid'
import UserLucid from '#models/user-model/user-lucid'
import { faker } from '@faker-js/faker'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { FavoritePostgresRepository } from '#repository/postgres-repository/favorite-postgres-repository'

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

  const sut = new FavoritePostgresRepository()

  return { sut, fakeFullVideo, fakeUserUuid: fakeUser.uuid }
}

test.group('FavoritePostgresRepository', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
  })

  test('should return true if video added to favorite on success', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()

    const added = await sut.addFavorite(fakeFullVideo.id, fakeFullVideo.userId, faker.string.uuid())
    expect(added).toBeTruthy()
  })

  test('should return true if video removed to favorite on success', async ({ expect }) => {
    const { sut, fakeFullVideo } = await makeSut()

    await Favorite.create({
      videoId: fakeFullVideo.id,
      userId: fakeFullVideo.userId,
      uuid: faker.string.uuid(),
    })

    const response = await sut.removeFavorite(fakeFullVideo.id, fakeFullVideo.userId)
    expect(response).toBeTruthy()
  })
})
