import VideoLucid from '#models/video-model/video-lucid'
import { faker } from '@faker-js/faker'
import { mockGenreEntity } from './mock-genre-entity.js'
import { mockLanguageEntity } from './mock-language-entity.js'
import { mockUserEntity } from './mock-user-entity.js'
import { LanguageLucid } from '#models/language-model/language-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import UserLucid from '#models/user-model/user-lucid'
import { makeYoutubeUrl } from '../makeYoutubeUrl.js'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'

type MockLucidEntity = {
  fakeLanguage: LanguageLucid
  fakeGenre: GenreLucid
  fakeUser: UserLucid
  fakeVideo: VideoLucid
  fakeFavorite: FavoriteLucid
}

export const mockLucidEntity = async (): Promise<MockLucidEntity> => {
  const fakeLanguage = await mockLanguageEntity()
  const fakeGenre = await mockGenreEntity()
  const fakeUser = await mockUserEntity()

  const fakeVideo = await VideoLucid.create({
    isDraft: false,
    title: faker.lorem.words(2),
    artist: faker.lorem.words(2),
    qtyViews: 0,
    releaseYear: faker.string.numeric({ length: 4 }),
    linkYoutube: makeYoutubeUrl(),
    uuid: faker.string.uuid(),
    languageId: fakeLanguage.id,
    genreId: fakeGenre.id,
    userId: fakeUser.id,
  })

  const fakeFavorite = await FavoriteLucid.create({
    videoId: fakeVideo.id,
    userId: fakeUser.id,
    uuid: faker.string.uuid(),
  })

  return {
    fakeLanguage,
    fakeGenre,
    fakeUser,
    fakeVideo,
    fakeFavorite,
  }
}
