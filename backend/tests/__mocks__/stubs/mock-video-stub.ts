import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoMetadata } from '#models/video-metadata'
import { VideoCreateInput, VideoUpdateInput } from '#models/video-save'
import { VideoFindProtocolService } from '#services/_protocols/video-find-protocol-service'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video-user-logged-protocol-service'
import { mockFakeVideoSaveResultModel } from '#tests/__mocks__/mock-video-save-result-model'

export const mockVideoData: VideoMetadata & {
  thumbnail: string
} = {
  uuid: 'any_uuid',
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'https://www.youtube.com/watch?v=93b9XX0GMGK',
  thumbnail: 'https://img.youtube.com/vi/93b9XX0GMGK/hqdefault.jpg',
  releaseYear: 'any_year',
  language: 'any_language',
  genre: 'any_genre',
  username: 'any_username',
  isFavorite: true,
}

export const mockVideoDataWithoutThumbnail: VideoMetadata = {
  uuid: 'any_uuid',
  title: 'any_title',
  artist: 'any_artist',
  linkYoutube: 'https://www.youtube.com/watch?v=93b9XX0GMGK',
  releaseYear: 'any_year',
  language: 'any_language',
  genre: 'any_genre',
  username: 'any_username',
  isFavorite: true,
}

export const mockVideoRepository: VideoRepository = {
  find: (uuid: string) => Promise.resolve(mockVideoDataWithoutThumbnail),
  findBy: (filters: VideoRepository.FindVideoParams) =>
    Promise.resolve([mockVideoDataWithoutThumbnail]),
  getVideoId: (uuid: string) => Promise.resolve(1),
  getUserId: (uuid: string) => Promise.resolve(0),
  getVideoUuidByYoutubeURL: (_: string) => Promise.resolve(undefined),
  delete: (uuid: string) => Promise.resolve(true),
  create: (params: VideoCreateInput) => Promise.resolve(mockFakeVideoSaveResultModel()),
  update: (params: VideoUpdateInput, uuid: string) => Promise.resolve(true),
  hasYoutubeLink: (link: string) => Promise.resolve(false),
}

export const mockVideoFindService: VideoFindProtocolService = {
  find: (uuid: string) => Promise.resolve(mockVideoData),
  findBy: (filters: VideoFindProtocolService.FindVideoParams) => Promise.resolve([mockVideoData]),
}

export const mockVideoUserLoggedService: VideoUserLoggedProtocolService = {
  isNotVideoOwnedByUserLogged: (uuid: string) => Promise.resolve(false),
  getVideosByUserLogged: () => Promise.resolve([mockVideoData]),
}
