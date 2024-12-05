import { ApplicationService } from '@adonisjs/core/types'

import { AuthService } from '#services/auth/auth-service'
import { FavoriteService } from '#services/favorite-service'
import { GenreService } from '#services/genre-service'
import { LanguageService } from '#services/language-service'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { FavoriteProtocolService } from '#services/protocols/favorite-protocol-service'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'
import { VideoCurrentUserProtocolService } from '#services/video/protocols/video-currentuser-protocol-service'
import { VideoDeleteProtocolService } from '#services/video/protocols/video-delete-protocol-service'
import { VideoFindProtocolService } from '#services/video/protocols/video-find-protocol-service'
import { VideoUpdateProtocolService } from '#services/video/protocols/video-update-protocol-service'
import { VideoCreateService } from '#services/video/video-create-service'
import { VideoCurrentUserService } from '#services/video/video-current-user-service'
import { VideoDeleteService } from '#services/video/video-delete-service'
import { VideoFindService } from '#services/video/video-find-service'
import { VideoUpdateService } from '#services/video/video-update-service'

import { FavoritePostgresRepository } from '../app/infra/db/postgres/favorite-postgres-repository.js'
import { GenrePostgresRepository } from '../app/infra/db/postgres/genre-postgres-repository.js'
import { LanguagePostgresRepository } from '../app/infra/db/postgres/language-postgres-repository.js'
import { UserPostgresRepository } from '../app/infra/db/postgres/user-postgres-repository.js'
import { VideoPostgresRepository } from '../app/infra/db/postgres/video-postgres-repository.js'
import { GenreRepository, LanguageRepository } from '../app/infra/db/protocols/base-repository.js'
import { FavoriteRepository } from '../app/infra/db/protocols/favorite-repository.js'
import { UserRepository } from '../app/infra/db/protocols/user-repository.js'
import { VideoRepository } from '../app/infra/db/protocols/video-repository.js'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    const diMap = [
      { protocol: AuthProtocolService, implementation: AuthService },
      { protocol: RegisterProtocolService, implementation: AuthService },
      { protocol: LanguageProtocolService, implementation: LanguageService },
      { protocol: GenreProtocolService, implementation: GenreService },
      { protocol: VideoFindProtocolService, implementation: VideoFindService },
      { protocol: VideoDeleteProtocolService, implementation: VideoDeleteService },
      { protocol: VideoCreateProtocolService, implementation: VideoCreateService },
      { protocol: VideoUpdateProtocolService, implementation: VideoUpdateService },
      { protocol: FavoriteProtocolService, implementation: FavoriteService },
      { protocol: VideoCurrentUserProtocolService, implementation: VideoCurrentUserService },

      { protocol: VideoRepository, implementation: VideoPostgresRepository },
      { protocol: FavoriteRepository, implementation: FavoritePostgresRepository },
      { protocol: UserRepository, implementation: UserPostgresRepository },
      { protocol: LanguageRepository, implementation: LanguagePostgresRepository },
      { protocol: GenreRepository, implementation: GenrePostgresRepository },
    ]

    diMap.forEach(({ protocol, implementation }) => {
      this.app.container.bind(protocol, async () => {
        return this.app.container.make(implementation)
      })
    })
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
