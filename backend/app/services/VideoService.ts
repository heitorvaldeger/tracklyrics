import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IFindAllVideoRepository } from '#repository/interfaces/IFindAllVideoRepository'
import { IFindVideoRepository } from '#repository/interfaces/IFindVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'

@inject()
export class VideoService implements IVideoService {
  constructor(
    private readonly findVideoRepository: IFindVideoRepository,
    private readonly findAllVideoRepository: IFindAllVideoRepository
  ) {}

  async findAll(): Promise<IVideoResponse[]> {
    return await this.findAllVideoRepository.findAll()
  }

  async find(uuid: string): Promise<IVideoResponse | null> {
    return await this.findVideoRepository.find(uuid)
  }
}
