import {
  IVideoRepository,
  VideoFindParams,
  VideoResponse,
  VideoSave,
} from '#infra/db/repository/interfaces/video-repository'
import { IVideoFindService } from '#services/interfaces/video-find-service'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'

export const mockVideoDataWithoutThumbnail: VideoResponse = {
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

export const mockVideoData: VideoResponse & {
  thumbnail: string
} = {
  ...mockVideoDataWithoutThumbnail,
  thumbnail: 'https://img.youtube.com/vi/93b9XX0GMGK/hqdefault.jpg',
}

export const mockVideoSave: VideoSave = {
  artist: 'any_artist',
  genreId: 0,
  isDraft: false,
  languageId: 0,
  linkYoutube: 'any_link',
  releaseYear: 'any_year',
  title: 'any_title',
  userId: 0,
  uuid: 'any_uuid',
}

export const mockVideoRepository: IVideoRepository = {
  find: (_: string) => Promise.resolve(mockVideoDataWithoutThumbnail),
  findBy: (_: VideoFindParams) => Promise.resolve([mockVideoDataWithoutThumbnail]),
  getVideoId: (_: string) => Promise.resolve(1),
  getUserId: (_: string) => Promise.resolve(0),
  getVideoUuidByYoutubeURL: (_: string) => Promise.resolve(undefined),
  delete: (_: string) => Promise.resolve(true),
  create: (_: VideoSave) => Promise.resolve(mockVideoSave),
  update: (_: VideoSave, __: string) => Promise.resolve(true),
  hasYoutubeLink: (_: string) => Promise.resolve(false),
}

export const mockVideoFindService: IVideoFindService = {
  find: (_: string) => Promise.resolve(mockVideoData),
  findBy: (_: VideoFindParams) => Promise.resolve([mockVideoData]),
}

export const mockVideoUserLoggedService: IVideoUserLoggedService = {
  isNotVideoOwnedByUserLogged: (_: string) => Promise.resolve(false),
  getVideosByUserLogged: () => Promise.resolve([mockVideoData]),
}
