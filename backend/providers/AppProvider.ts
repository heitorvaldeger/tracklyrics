import { ApplicationService } from '@adonisjs/core/types'

import { CryptoAdapter } from '#infra/crypto/crypto-adapter'
import { HashAdapter } from '#infra/crypto/protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'
import { CacheAdapter } from '#infra/db/cache/protocols/cache-adapter'
import { RedisAdonisAdapter } from '#infra/db/cache/redis-adonis-adapter'
import { FavoritePostgresRepository } from '#infra/db/repository/postgres/favorite-postgres-repository'
import { GenrePostgresRepository } from '#infra/db/repository/postgres/genre-postgres-repository'
import { LanguagePostgresRepository } from '#infra/db/repository/postgres/language-postgres-repository'
import { UserPostgresRepository } from '#infra/db/repository/postgres/user-postgres-repository'
import { VideoPostgresRepository } from '#infra/db/repository/postgres/video-postgres-repository'
import { FavoriteRepository } from '#infra/db/repository/protocols/favorite-repository'
import { GenreRepository } from '#infra/db/repository/protocols/genre-repository'
import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { UserRepository } from '#infra/db/repository/protocols/user-repository'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { AuthService } from '#services/auth/auth-service'
import { FavoriteService } from '#services/favorite-service'
import { GenreService } from '#services/genre-service'
import { LanguageService } from '#services/language-service'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { FavoriteProtocolService } from '#services/protocols/favorite-protocol-service'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'
import { VideoCreateProtocolService } from '#services/protocols/video/video-create-protocol-service'
import { VideoCurrentUserProtocolService } from '#services/protocols/video/video-currentuser-protocol-service'
import { VideoDeleteProtocolService } from '#services/protocols/video/video-delete-protocol-service'
import { VideoFindProtocolService } from '#services/protocols/video/video-find-protocol-service'
import { VideoUpdateProtocolService } from '#services/protocols/video/video-update-protocol-service'
import { VideoCreateService } from '#services/video/video-create-service'
import { VideoCurrentUserService } from '#services/video/video-current-user-service'
import { VideoDeleteService } from '#services/video/video-delete-service'
import { VideoFindService } from '#services/video/video-find-service'
import { VideoUpdateService } from '#services/video/video-update-service'

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

      { protocol: OTPAdapter, implementation: CryptoAdapter },
      { protocol: HashAdapter, implementation: CryptoAdapter },

      { protocol: CacheAdapter, implementation: RedisAdonisAdapter },
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
