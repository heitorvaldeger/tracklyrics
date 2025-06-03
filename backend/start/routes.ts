/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const RegisterController = () => import('#controllers/auth/RegisterController')
const LoginController = () => import('#controllers/auth/LoginController')
const ValidateEmailController = () => import('#controllers/auth/ValidateEmailController')
const UpdatePasswordController = () => import('#controllers/user/UpdatePasswordController')
const ValidateUpdatePasswordController = () =>
  import('#controllers/user/ValidateUpdatePasswordController')
const GetInfoByUserLoggedController = () =>
  import('#controllers/user/GetInfoByUserLoggedController')
import { middleware } from '#start/kernel'

const FindLyricController = () => import('#controllers/FindLyricController')
const GameController = () => import('#controllers/game-controller')
const FavoriteController = () => import('#controllers/favorite-controller')

const FindAllLanguageController = () => import('#controllers/FindAllLanguageController')
const FindAllGenreController = () => import('#controllers/FindAllGenreController')
const VideoFindController = () => import('#controllers/video-find-controller')
const VideoCreateController = () => import('#controllers/video-create-controller')
const VideoDeleteController = () => import('#controllers/video-delete-controller')
const VideoUpdateController = () => import('#controllers/video-update-controller')
const VideoUserLoggedController = () => import('#controllers/video-user-logged-controller')
const LogoutController = () => import('#controllers/auth/LogoutController')

router.get('/languages', [FindAllLanguageController])
router.get('/genres', [FindAllGenreController])

router.get('/session', async ({ response, auth }) => {
  const hasSession = await auth.check()
  return response.status(200).json({
    hasSession,
  })
})

router
  .group(() => {
    router.post('/login', [LoginController])
    router.post('/logout', [LogoutController])
    router.post('/register', [RegisterController])
    router.post('/validate-email', [ValidateEmailController])
  })
  .prefix('auth')

router
  .group(() => {
    router.get(':uuid', [VideoFindController, 'find'])
    router.get('', [VideoFindController, 'findBy'])
    router.get(':uuid/lyrics', [FindLyricController])
    router
      .group(() => {
        router.post('', [VideoCreateController, 'create'])
        router.put(':uuid', [VideoUpdateController, 'update'])
        router.delete(':uuid', [VideoDeleteController, 'delete'])
      })
      .use(
        middleware.auth({
          guards: ['web'],
        })
      )
  })
  .prefix('videos')

router
  .group(() => {
    router.put(':uuid/play', [GameController, 'play'])
    router.get(':uuid/play/:mode', [GameController, 'getGame'])
    router.get(':uuid/modes', [GameController, 'getModes'])
  })
  .prefix('game')

router
  .group(() => {
    router
      .group(() => {
        router.get('', [FavoriteController, 'findFavoritesByUserLogged'])
        router.post(':uuid', [FavoriteController, 'saveFavorite'])
        router.delete(':uuid', [FavoriteController, 'removeFavorite'])
      })
      .prefix('favorites')
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

router
  .group(() => {
    router.group(() => {
      router.get('', [GetInfoByUserLoggedController])
      router.get('my-lyrics', [VideoUserLoggedController, 'getVideosByUserLogged'])
      router.patch('update-password', [UpdatePasswordController])
      router.patch('validate-update-password', [ValidateUpdatePasswordController])
    })
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
  .prefix('user')
