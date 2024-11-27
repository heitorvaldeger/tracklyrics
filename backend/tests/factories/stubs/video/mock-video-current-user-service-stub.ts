import { IVideoCurrentUserService } from '#services/video/interfaces/IVideoCurrentUserService'

export const mockVideoCurrentUserServiceStub = () => {
  class VideoCurrentUserServiceService implements IVideoCurrentUserService {
    isNotVideoOwnedByCurrentUser(uuid: string): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  return new VideoCurrentUserServiceService()
}
