import VideoLucid from '#models/video-model/video-lucid'
import { faker } from '@faker-js/faker'
import { mockGenreEntity } from './mock-genre-entity.js'
import { mockLanguageEntity } from './mock-language-entity.js'
import { mockUserEntity } from './mock-user-entity.js'
import { LanguageLucid } from '#models/language-model/language-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import UserLucid from '#models/user-model/user-lucid'

type MockVideoEntity = {
  fakeLanguage: LanguageLucid
  fakeGenre: GenreLucid
  fakeUser: UserLucid
  fakeVideo: VideoLucid
}

export const mockVideoEntity = async (): Promise<MockVideoEntity> => {
  const fakeLanguage = await mockLanguageEntity()
  const fakeGenre = await mockGenreEntity()
  const fakeUser = await mockUserEntity()

  const fakeVideo = await VideoLucid.create({
    isDraft: false,
    title: faker.lorem.words(2),
    artist: faker.lorem.words(2),
    qtyViews: 0,
    releaseYear: faker.string.numeric({ length: 4 }),
    linkYoutube: faker.internet.url(),
    uuid: faker.string.uuid(),
    languageId: fakeLanguage.id,
    genreId: fakeGenre.id,
    userId: fakeUser.id,
  })

  return {
    fakeLanguage,
    fakeGenre,
    fakeUser,
    fakeVideo,
  }
}
