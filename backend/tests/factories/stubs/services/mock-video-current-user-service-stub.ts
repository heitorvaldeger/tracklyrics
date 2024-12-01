import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'

export const mockVideoCurrentUserServiceStub = (): VideoCurrentUserProtocolService => ({
  isNotVideoOwnedByCurrentUser: (uuid: string) => Promise.resolve(false),
})
