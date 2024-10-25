import { ApplicationService } from '@adonisjs/core/types'
import { IVideoService } from '#services/interfaces/IVideoService'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { GenrerService } from '#services/GenrerService'
import { FindAllGenrerPostgresRepository } from '#repository/postgres/genrers/FindAllGenrerPostgresRepository'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { VideoService } from '#services/VideoService'
import { VideoPostgresRepository } from '#repository/postgres/videos/VideoPostgresRepository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    this.app.container.bind(IVideoService, async () => {
      return this.app.container.make(VideoService)
    })

    this.app.container.bind(IVideoRepository, async () => {
      return this.app.container.make(VideoPostgresRepository)
    })

    this.app.container.bind(IGenrerService, async () => {
      return new GenrerService(await this.app.container.make(FindAllGenrerPostgresRepository))
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
