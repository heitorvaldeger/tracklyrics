import _ from 'lodash'

import { createSuccessResponse } from '#helpers/method-response'
import { VideoFindProtocolService } from '#services/video/protocols/video-find-protocol-service'
import { mockFakeVideoModel } from '#tests/factories/fakes/mock-fake-video-model'

export const mockVideoFindServiceStub = (): VideoFindProtocolService => ({
  find: (_uuid: string) => Promise.resolve(createSuccessResponse(mockFakeVideoModel())),
  findBy: (_filters: VideoFindProtocolService.FindVideoParams) =>
    Promise.resolve(createSuccessResponse([mockFakeVideoModel()])),
})
