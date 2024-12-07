import { VideoFindModel } from '#models/video-model/video-find-model'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'

export abstract class VideoRepository {
  abstract find(uuid: string): Promise<VideoFindModel | null>
  abstract findBy(filters: VideoRepository.FindVideoParams): Promise<VideoFindModel[]>
  abstract getVideoId(videoUuid: string): Promise<number | null>
  abstract getUserId(videoUuid: string): Promise<number | null>
  abstract delete(uuid: string): Promise<boolean>
  abstract create(payload: VideoRepository.CreateVideoParams): Promise<VideoSaveResultModel>
  abstract update(
    payload: Partial<VideoRepository.UpdateVideoParams>,
    uuid: string
  ): Promise<boolean>
  abstract hasYoutubeLink(link: string): Promise<boolean>
}

export namespace VideoRepository {
  export type FindVideoParams = Partial<{
    genreId: number
    languageId: number
    userUuid: string
  }>

  export type CreateVideoParams = {
    title: string
    artist: string
    releaseYear: string
    linkYoutube: string
    languageId: number
    genreId: number
    userId: number
    uuid: string
    isDraft?: boolean
  }

  export type UpdateVideoParams = Partial<CreateVideoParams>
}
