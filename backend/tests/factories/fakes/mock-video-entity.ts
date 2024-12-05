import { faker } from '@faker-js/faker'

import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockGenreEntity } from '#tests/factories/fakes/mock-genre-entity'
import { mockLanguageEntity } from '#tests/factories/fakes/mock-language-entity'
import { mockUserEntity } from '#tests/factories/fakes/mock-user-entity'
import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'

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
