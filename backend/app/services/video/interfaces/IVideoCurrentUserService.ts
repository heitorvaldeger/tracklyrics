export abstract class IVideoCurrentUserService {
  abstract isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean>
}
