export abstract class IVideoPlayCountRepository {
  abstract increment(videoId: number): Promise<void>
}
