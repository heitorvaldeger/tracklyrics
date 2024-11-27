export abstract class IVideoOwnedByCurrentUser {
  abstract isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean>
}
