import { VideoFindParams } from '../../params/video-params/video-find-params.js'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { VideoSaveParams } from '../../params/video-params/video-save-params.js'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'

export abstract class IVideoRepository {
  abstract find(uuid: string): Promise<VideoFindModel | null>
  abstract findBy(filters: Partial<VideoFindParams>): Promise<VideoFindModel[]>
  abstract getVideoId(videoUuid: string): Promise<number | null>
  abstract getUserId(videoUuid: string): Promise<number | null>
  abstract delete(uuid: string): Promise<boolean>
  abstract create(payload: VideoSaveParams): Promise<VideoSaveResultModel>
  abstract update(payload: Partial<VideoSaveParams>, uuid: string): Promise<boolean>
  abstract hasYoutubeLink(link: string): Promise<boolean>
  abstract addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean>
  abstract removeFavorite(videoId: number, userId: number): Promise<boolean>
}
