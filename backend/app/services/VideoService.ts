import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IFindVideoRepository } from '#repository/interfaces/IFindVideoRepository'
import { inject } from '@adonisjs/core'
import { IVideoService } from './interfaces/IVideoService.js'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

@inject()
export class VideoService implements IVideoService {
  constructor(
    private readonly findVideoRepository: IFindVideoRepository,
    private readonly findAllRepository: IFindAllRepository
  ) {}

  async findAll(): Promise<IVideoResponse[]> {
    return await this.findAllRepository.findAll()
  }

  async find(uuid: string): Promise<IVideoResponse | null> {
    return await this.findVideoRepository.find(uuid)
  }
}
