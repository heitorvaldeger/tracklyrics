import { ApplicationService } from '@adonisjs/core/types'
import { IVideoService } from '#services/interfaces/IVideoService'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { GenrerService } from '#services/GenrerService'
import { GenrerPostgresRepository } from '#repository/postgres/GenrerPostgresRepository'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { VideoService } from '#services/VideoService'
import { VideoPostgresRepository } from '#repository/postgres/VideoPostgresRepository'
import { ILanguageService } from '#services/interfaces/ILanguageService'
import { LanguageService } from '#services/LanguageService'
import { LanguagePostgresRepository } from '#repository/postgres/LanguagePostgresRepository'

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
      return new GenrerService(await this.app.container.make(GenrerPostgresRepository))
    })

    this.app.container.bind(ILanguageService, async () => {
      return new LanguageService(await this.app.container.make(LanguagePostgresRepository))
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
