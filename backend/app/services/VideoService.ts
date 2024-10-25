import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'

@inject()
export class VideoService implements IVideoService {
  constructor(private readonly videoRepository: IVideoRepository) {}

  async findAll(): Promise<IVideoResponse[]> {
    const videos = await this.videoRepository.findAll()
    return this.mapperVideos(videos)
  }

  async find(uuid: string): Promise<IVideoResponse | null> {
    return await this.videoRepository.find(uuid)
  }

  async findByGenrer(genrerId: number): Promise<IVideoResponse[]> {
    const videos = await this.videoRepository.findByGenrer(genrerId)
    return this.mapperVideos(videos)
  }

  async findByLanguage(languageId: number): Promise<IVideoResponse[]> {
    const videos = await this.videoRepository.findByLanguage(languageId)
    return this.mapperVideos(videos)
  }

  private mapperVideos(videos: IVideoResponse[]) {
    return videos.map((video) => ({
      ...video,
      qtyViews: BigInt(video.qtyViews),
    }))
  }
}
