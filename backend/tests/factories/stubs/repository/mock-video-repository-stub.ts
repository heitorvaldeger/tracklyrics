import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { mockVideoModel } from '#tests/factories/mocks/mock-video-model'
import { mockFakeVideoSaveResultModel } from '#tests/factories/mocks/mock-video-save-result-model'

export const mockVideoRepositoryStub = (): VideoRepository => ({
  find: (uuid: string) => Promise.resolve(mockVideoModel()),
  findBy: (filters: VideoRepository.FindVideoParams) => Promise.resolve([]),
  getVideoId: (uuid: string) => Promise.resolve(1),
  getUserId: (uuid: string) => Promise.resolve(0),
  delete: (uuid: string) => Promise.resolve(true),
  create: (params: VideoRepository.CreateVideoParams) =>
    Promise.resolve(mockFakeVideoSaveResultModel()),
  update: (params: VideoRepository.UpdateVideoParams, uuid: string) => Promise.resolve(true),
  hasYoutubeLink: (link: string) => Promise.resolve(false),
})
