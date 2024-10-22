import { randomUUID } from 'node:crypto'
import Video from '#models/video'

export const makeFakeVideo = async () => {
  const uuid = randomUUID()
  const fakeVideo = {
    isDraft: false,
    title: 'any_title',
    artist: 'any_artist',
    qtyViews: BigInt(0),
    releaseYear: '2000',
    linkYoutube: 'any_link',
    uuid: uuid,
  }
  await Video.create(fakeVideo)
  return fakeVideo
}
