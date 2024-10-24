import { FindVideoPostgresRepository } from '#repository/postgres/videos/FindVideoPostgresRepository'
import { ApplicationService } from '@adonisjs/core/types'
import { FindAllVideoPostgresRepository } from '#repository/postgres/videos/FindAllVideoPostgresRepository'
import { IVideoService } from '#services/interfaces/IVideoService'
import { VideoService } from '#services/VideoService'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { GenrerService } from '#services/GenrerService'
import { FindAllGenrerPostgresRepository } from '#repository/postgres/genrers/FindAllGenrerPostgresRepository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    this.app.container.bind(IVideoService, async () => {
      return new VideoService(
        await this.app.container.make(FindVideoPostgresRepository),
        await this.app.container.make(FindAllVideoPostgresRepository)
      )
    })

    this.app.container.bind(IGenrerService, async () => {
      return new GenrerService(await this.app.container.make(FindAllGenrerPostgresRepository))
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
