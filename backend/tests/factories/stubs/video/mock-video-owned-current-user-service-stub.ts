import { IVideoOwnedByCurrentUser } from '#services/video/interfaces/IVideoOwnedByCurrentUser'

export const mockVideoOwnedCurrentUserServiceStub = () => {
  class VideoOwnedByCurrentUserService implements IVideoOwnedByCurrentUser {
    isNotVideoOwnedByCurrentUser(uuid: string): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  return new VideoOwnedByCurrentUserService()
}
