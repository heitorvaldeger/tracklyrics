export abstract class VideoCurrentUserProtocolService {
  abstract isNotVideoOwnedByCurrentUser(videoUuid: string): Promise<boolean>
}
