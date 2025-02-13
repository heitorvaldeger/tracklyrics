import { createSuccessResponse } from '#helpers/method-response'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { VideoCurrentUserProtocolService } from '#services/protocols/video/video-currentuser-protocol-service'
import { VideoFindProtocolService } from '#services/protocols/video/video-find-protocol-service'
import { mockFakeVideoSaveResultModel } from '#tests/__mocks__/mock-video-save-result-model'

export const mockVideoData: VideoFindModel & {
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
}

export const mockVideoRepositoryStub = (): VideoRepository => ({
  find: (uuid: string) => Promise.resolve(mockVideoData),
  findBy: (filters: VideoRepository.FindVideoParams) => Promise.resolve([]),
  getVideoId: (uuid: string) => Promise.resolve(1),
  getUserId: (uuid: string) => Promise.resolve(0),
  delete: (uuid: string) => Promise.resolve(true),
  create: (params: VideoRepository.CreateVideoParams) =>
    Promise.resolve(mockFakeVideoSaveResultModel()),
  update: (params: VideoRepository.UpdateVideoParams, uuid: string) => Promise.resolve(true),
  hasYoutubeLink: (link: string) => Promise.resolve(false),
})

export const mockVideoFindServiceStub = (): VideoFindProtocolService => ({
  find: (uuid: string) => Promise.resolve(createSuccessResponse(mockVideoData)),
  findBy: (filters: VideoFindProtocolService.FindVideoParams) =>
    Promise.resolve(createSuccessResponse([mockVideoData])),
})

export const mockVideoCurrentUserServiceStub = (): VideoCurrentUserProtocolService => ({
  isNotVideoOwnedByCurrentUser: (uuid: string) => Promise.resolve(false),
})
