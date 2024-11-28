import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'

export const mockVideoCurrentUserServiceStub = () => {
  class VideoCurrentUserServiceService implements VideoCurrentUserProtocolService {
    isNotVideoOwnedByCurrentUser(uuid: string): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  return new VideoCurrentUserServiceService()
}
