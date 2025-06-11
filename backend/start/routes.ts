/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'

const RegisterController = () => import('#controllers/auth/RegisterController')
const LoginController = () => import('#controllers/auth/LoginController')
const ValidateEmailController = () => import('#controllers/auth/ValidateEmailController')
const UpdatePasswordController = () => import('#controllers/user/UpdatePasswordController')
const ValidateUpdatePasswordController = () =>
  import('#controllers/user/ValidateUpdatePasswordController')
const GetInfoByUserLoggedController = () =>
  import('#controllers/user/GetInfoByUserLoggedController')
const SaveFavoriteController = () => import('#controllers/favorite/SaveFavoriteController')
const DeleteFavoriteController = () => import('#controllers/favorite/DeleteFavoriteController')
const GetModesGameController = () => import('#controllers/game/GetModesGameController')
const PlayGameController = () => import('#controllers/game/PlayGameController')
const FindVideoController = () => import('#controllers/video/FindVideoController')
const CreateVideoController = () => import('#controllers/video/CreateVideoController')
const DeleteVideoController = () => import('#controllers/video/DeleteVideoController')

const FindLyricController = () => import('#controllers/FindLyricsByVideoUUIDController')
const GetGameController = () => import('#controllers/game/GetGameController')
const FavoriteController = () => import('#controllers/favorite/FindFavoritesByUserLoggedController')

const FindAllLanguageController = () => import('#controllers/FindAllLanguageController')
const FindAllGenreController = () => import('#controllers/FindAllGenreController')
const FindByVideoController = () => import('#controllers/video/FindByVideoController')
const UpdateVideoController = () => import('#controllers/video/UpdateVideoController')
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
    router.get(':uuid', [FindVideoController])
    router.get('', [FindByVideoController])
    router.get(':uuid/lyrics', [FindLyricController])
    router
      .group(() => {
        router.post('', [CreateVideoController])
        router.put(':uuid', [UpdateVideoController])
        router.delete(':uuid', [DeleteVideoController])
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
    router.put(':uuid/play', [PlayGameController])
    router.get(':uuid/play/:mode', [GetGameController])
    router.get(':uuid/modes', [GetModesGameController])
  })
  .prefix('game')

router
  .group(() => {
    router
      .group(() => {
        router.get('', [FavoriteController])
        router.post(':uuid', [SaveFavoriteController])
        router.delete(':uuid', [DeleteFavoriteController])
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
