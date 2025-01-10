import { VideoCurrentUserProtocolService } from '#services/protocols/video/video-currentuser-protocol-service'

export const mockVideoCurrentUserServiceStub = (): VideoCurrentUserProtocolService => ({
  isNotVideoOwnedByCurrentUser: (uuid: string) => Promise.resolve(false),
})
