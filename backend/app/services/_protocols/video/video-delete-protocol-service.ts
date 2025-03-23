export abstract class VideoDeleteProtocolService {
  abstract delete(uuid: string): Promise<boolean>
}
