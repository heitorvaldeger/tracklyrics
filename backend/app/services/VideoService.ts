import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'

@inject()
export class VideoService implements IVideoService {
  constructor(private readonly videoRepository: IVideoRepository) {}

  async findAll(): Promise<IVideoResponse[]> {
    return await this.videoRepository.findAll()
  }

  async find(uuid: string): Promise<IVideoResponse | null> {
    return await this.videoRepository.find(uuid)
  }

  async findByGenrer(genrerId: number): Promise<IVideoResponse | null> {
    return await this.videoRepository.findByGenrer(genrerId)
  }
}
