import VideoLucid from '#models/video-model/video-lucid'
import { faker } from '@faker-js/faker'
import { mockGenrerEntity } from './mock-genrer-entity.js'
import { mockLanguageEntity } from './mock-language-entity.js'
import { mockUserEntity } from './mock-user-entity.js'
import { LanguageLucid } from '#models/language-model/language-lucid'
import GenrerLucid from '#models/genrer-model/genrer-lucid'
import UserLucid from '#models/user-model/user-lucid'

type MockVideoEntity = {
  fakeLanguage: LanguageLucid
  fakeGenrer: GenrerLucid
  fakeUser: UserLucid
  fakeVideo: VideoLucid
}

export const mockVideoEntity = async (): Promise<MockVideoEntity> => {
  const fakeLanguage = await mockLanguageEntity()
  const fakeGenrer = await mockGenrerEntity()
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
    genrerId: fakeGenrer.id,
    userId: fakeUser.id,
  })

  return {
    fakeLanguage,
    fakeGenrer,
    fakeUser,
    fakeVideo,
  }
}
