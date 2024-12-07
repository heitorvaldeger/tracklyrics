import _ from 'lodash'

import { createSuccessResponse } from '#helpers/method-response'
import { VideoFindProtocolService } from '#services/protocols/video/video-find-protocol-service'
import { mockVideoModel } from '#tests/factories/mocks/mock-video-model'

export const mockVideoFindServiceStub = (): VideoFindProtocolService => ({
  find: (_uuid: string) => Promise.resolve(createSuccessResponse(mockVideoModel())),
  findBy: (_filters: VideoFindProtocolService.FindVideoParams) =>
    Promise.resolve(createSuccessResponse([mockVideoModel()])),
})
