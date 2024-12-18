import { createSuccessResponse } from '#helpers/method-response'
import { GameProtocolService } from '#services/protocols/game-protocol-service'
import { makeGameModesStub } from '#tests/factories/makeGameModesResponse'

export const mockGameServiceStub = (): GameProtocolService => ({
  play: (videoUuid: string) => Promise.resolve(createSuccessResponse()),
  getModes: (videoUuid: string) => Promise.resolve(createSuccessResponse(makeGameModesStub().stub)),
})
