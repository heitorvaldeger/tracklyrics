import { VideoRepository } from '#repository/protocols/video-repository'
import { mockFakeVideoModel, mockFakeVideoSaveResultModel } from '#tests/factories/fakes/index'

export const mockVideoRepositoryStub = (): VideoRepository => ({
  find: (uuid: string) => Promise.resolve(mockFakeVideoModel()),
  findBy: (filters: VideoRepository.FindVideoParams) => Promise.resolve([]),
  getVideoId: (uuid: string) => Promise.resolve(1),
  getUserId: (uuid: string) => Promise.resolve(0),
  delete: (uuid: string) => Promise.resolve(true),
  create: (params: VideoRepository.CreateVideoParams) =>
    Promise.resolve(mockFakeVideoSaveResultModel()),
  update: (params: VideoRepository.UpdateVideoParams, uuid: string) => Promise.resolve(true),
  hasYoutubeLink: (link: string) => Promise.resolve(false),
})
