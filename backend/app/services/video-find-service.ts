import { inject } from '@adonisjs/core'
import _ from 'lodash'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoMetadata } from '#models/video-metadata'
import { VideoFindProtocolService } from '#services/_protocols/video-find-protocol-service'
import { getYoutubeThumbnail } from '#utils/index'

@inject()
export class VideoFindService implements VideoFindProtocolService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async find(uuid: string) {
    const video = await this.videoRepository.find(uuid)
    if (!video) {
      throw new VideoNotFoundException()
    }

    return {
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }
  }

  async findBy(filters: Partial<VideoRepository.FindVideoParams>) {
    const videos = await this.videoRepository.findBy(filters)

    return videos.map((video) => ({
      ...video,
      thumbnail: getYoutubeThumbnail(video.linkYoutube),
    }))
  }
}
