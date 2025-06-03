import { ApplicationService } from '@adonisjs/core/types'

import { Crypto } from '#core/infra/crypto/crypto'
import { IHashAdapter } from '#core/infra/crypto/interfaces/hash-adapter'
import { IOTPAdapter } from '#core/infra/crypto/interfaces/otp-adapter'
import { ICacheAdapter } from '#core/infra/db/cache/interfaces/cache-adapter'
import { RedisAdonis } from '#core/infra/db/cache/redis-adonis'
import { FavoritePostgresRepository } from '#core/infra/db/repository/favorite-repository'
import { GenrePostgresRepository } from '#core/infra/db/repository/genre-repository'
import { IFavoriteRepository } from '#core/infra/db/repository/interfaces/favorite-repository'
import { IGenreRepository } from '#core/infra/db/repository/interfaces/genre-repository'
import { ILanguageRepository } from '#core/infra/db/repository/interfaces/language-repository'
import { ILyricRepository } from '#core/infra/db/repository/interfaces/lyric-repository'
import { IUserRepository } from '#core/infra/db/repository/interfaces/user-repository'
import { IVideoPlayCountRepository } from '#core/infra/db/repository/interfaces/video-play-count-repository'
import { IVideoRepository } from '#core/infra/db/repository/interfaces/video-repository'
import { LanguagePostgresRepository } from '#core/infra/db/repository/language-repository'
import { LyricPostgresRepository } from '#core/infra/db/repository/lyric-repository'
import { PlayPostgresRepository } from '#core/infra/db/repository/play-repository'
import { UserPostgresRepository } from '#core/infra/db/repository/user-repository'
import { VideoPostgresRepository } from '#core/infra/db/repository/video-repository'
import { AuthService } from '#services/auth-service'
import { FavoriteService } from '#services/favorite-service'
import { GameService } from '#services/game-service'
import { GenreService } from '#services/genre-service'
import { IAuthService } from '#services/interfaces/auth-service'
import { IFavoriteService } from '#services/interfaces/favorite-service'
import { IGameService } from '#services/interfaces/game-service'
import { IGenreService } from '#services/interfaces/genre-service'
import { ILanguageService } from '#services/interfaces/language-service'
import { ILyricFindService } from '#services/interfaces/lyric-find-service'
import { IUserService } from '#services/interfaces/user-service'
import { IVideoCreateService } from '#services/interfaces/video-create-service'
import { IVideoDeleteService } from '#services/interfaces/video-delete-service'
import { IVideoFindService } from '#services/interfaces/video-find-service'
import { IVideoUpdateService } from '#services/interfaces/video-update-service'
import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'
import { LanguageService } from '#services/language-service'
import { LyricFindService } from '#services/lyric-find-service'
import { UserService } from '#services/user-service'
import { VideoCreateService } from '#services/video-create-service'
import { VideoDeleteService } from '#services/video-delete-service'
import { VideoFindService } from '#services/video-find-service'
import { VideoUpdateService } from '#services/video-update-service'
import { VideoUserLoggedService } from '#services/video-user-logged-service'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    const diMap = [
      { protocol: IAuthService, implementation: AuthService },
      { protocol: ILanguageService, implementation: LanguageService },
      { protocol: IGenreService, implementation: GenreService },
      { protocol: IVideoFindService, implementation: VideoFindService },
      { protocol: IVideoDeleteService, implementation: VideoDeleteService },
      { protocol: IVideoCreateService, implementation: VideoCreateService },
      { protocol: IVideoUpdateService, implementation: VideoUpdateService },
      { protocol: IFavoriteService, implementation: FavoriteService },
      { protocol: IVideoUserLoggedService, implementation: VideoUserLoggedService },
      { protocol: ILyricFindService, implementation: LyricFindService },
      { protocol: IGameService, implementation: GameService },
      { protocol: IUserService, implementation: UserService },

      { protocol: IVideoRepository, implementation: VideoPostgresRepository },
      { protocol: IFavoriteRepository, implementation: FavoritePostgresRepository },
      { protocol: IUserRepository, implementation: UserPostgresRepository },
      { protocol: ILanguageRepository, implementation: LanguagePostgresRepository },
      { protocol: IGenreRepository, implementation: GenrePostgresRepository },
      { protocol: IVideoPlayCountRepository, implementation: PlayPostgresRepository },
      { protocol: ILyricRepository, implementation: LyricPostgresRepository },
      { protocol: IUserRepository, implementation: UserPostgresRepository },

      { protocol: IOTPAdapter, implementation: Crypto },
      { protocol: IHashAdapter, implementation: Crypto },

      { protocol: ICacheAdapter, implementation: RedisAdonis },
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
