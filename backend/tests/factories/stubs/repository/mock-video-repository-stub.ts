import { mockFakeVideoModel, mockFakeVideoSaveResultModel } from '#tests/factories/fakes/index'

import { VideoRepository } from '../../../../app/infra/db/protocols/video-repository.js'

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
