export abstract class VideoPlayCountRepository {
  abstract increment(videoId: number): Promise<void>
}
