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
import { middleware } from '#start/kernel'

const LyricFindController = () => import('#controllers/lyric-find-controller')
const GameController = () => import('#controllers/game-controller')
const FavoriteController = () => import('#controllers/favorite-controller')

const LanguageController = () => import('#controllers/language-controller')
const GenreController = () => import('#controllers/genre-controller')
const VideoFindController = () => import('#controllers/video-find-controller')
const VideoCreateController = () => import('#controllers/video-create-controller')
const VideoDeleteController = () => import('#controllers/video-delete-controller')
const VideoUpdateController = () => import('#controllers/video-update-controller')
const VideoUserLoggedController = () => import('#controllers/video-user-logged-controller')
const AuthController = () => import('#controllers/auth-controller')
const UserController = () => import('#controllers/user-controller')

router.post('/login', [LoginController, 'handle'])
router.post('/logout', [AuthController, 'logout'])
router.post('/register', [RegisterController, 'handle'])
router.post('/validate-email', [AuthController, 'validateEmail'])
router.get('/languages', [LanguageController, 'findAll'])
router.get('/genres', [GenreController, 'findAll'])

router.get('/session', async ({ response, auth }) => {
  const hasSession = await auth.check()
  return response.status(200).json({
    hasSession,
  })
})

router
  .group(() => {
    router.get(':uuid', [VideoFindController, 'find'])
    router.get('', [VideoFindController, 'findBy'])
    router.get(':uuid/lyrics', [LyricFindController, 'find'])
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
    router
      .group(() => {
        router.get('', [UserController, 'getFullInfoByUserLogged'])
        router.get('my-lyrics', [VideoUserLoggedController, 'getVideosByUserLogged'])
        router.patch('update-password', [UserController, 'updatePassword'])
        router.patch('validate-update-password', [UserController, 'validateUpdatePassword'])
      })
      .prefix('user')
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
