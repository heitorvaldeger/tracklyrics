import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'
import { VideoMetadata } from '#models/video-metadata'
import { VideoCreateInput, VideoUpdateInput } from '#models/video-save'
import { IVideoFindService } from '#services/interfaces/video-find-service'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'
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

export const mockVideoRepository: IVideoRepository = {
  find: (uuid: string) => Promise.resolve(mockVideoDataWithoutThumbnail),
  findBy: (filters: IVideoRepository.FindVideoParams) =>
    Promise.resolve([mockVideoDataWithoutThumbnail]),
  getVideoId: (uuid: string) => Promise.resolve(1),
  getUserId: (uuid: string) => Promise.resolve(0),
  getVideoUuidByYoutubeURL: (_: string) => Promise.resolve(undefined),
  delete: (uuid: string) => Promise.resolve(true),
  create: (params: VideoCreateInput) => Promise.resolve(mockFakeVideoSaveResultModel()),
  update: (params: VideoUpdateInput, uuid: string) => Promise.resolve(true),
  hasYoutubeLink: (link: string) => Promise.resolve(false),
}

export const mockVideoFindService: IVideoFindService = {
  find: (uuid: string) => Promise.resolve(mockVideoData),
  findBy: (filters: IVideoFindService.FindVideoParams) => Promise.resolve([mockVideoData]),
}

export const mockVideoUserLoggedService: IVideoUserLoggedService = {
  isNotVideoOwnedByUserLogged: (uuid: string) => Promise.resolve(false),
  getVideosByUserLogged: () => Promise.resolve([mockVideoData]),
}
