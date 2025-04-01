import { VideoMetadata } from '#models/video-metadata'
import { VideoCreateInput, VideoSaveResult, VideoUpdateInput } from '#models/video-save'

export abstract class IVideoRepository {
  abstract find(uuid: string): Promise<VideoMetadata | null>
  abstract findBy(filters: IVideoRepository.FindVideoParams): Promise<VideoMetadata[]>
  abstract getVideoId(videoUuid: string): Promise<number | null>
  abstract getVideoUuidByYoutubeURL(videoUuid: string): Promise<string | undefined>
  abstract getUserId(videoUuid: string): Promise<number | null>
  abstract delete(uuid: string): Promise<boolean>
  abstract create(payload: VideoCreateInput): Promise<VideoSaveResult>
  abstract update(payload: VideoUpdateInput, uuid: string): Promise<boolean>
  abstract hasYoutubeLink(link: string): Promise<boolean>
}

export namespace IVideoRepository {
  export type FindVideoParams = Partial<{
    genreId: number
    languageId: number
    userUuid: string
  }>
}
