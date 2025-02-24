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

const LyricSaveController = () => import('#controllers/lyric/lyric-save-controller')
const LyricFindController = () => import('#controllers/lyric/lyric-find-controller')
const GameController = () => import('#controllers/game-controller')
const FavoriteController = () => import('#controllers/favorite-controller')

const LanguageController = () => import('#controllers/language-controller')
const GenreController = () => import('#controllers/genre-controller')
const VideoFindController = () => import('#controllers/video/video-find-controller')
const VideoCreateController = () => import('#controllers/video/video-create-controller')
const VideoDeleteController = () => import('#controllers/video/video-delete-controller')
const VideoUserLoggedController = () => import('#controllers/video/video-user-logged-controller')
const AuthController = () => import('#controllers/auth-controller')
const UserController = () => import('#controllers/user-controller')

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/validate-email', [AuthController, 'validateEmail'])
router.get('/languages', [LanguageController, 'findAll'])
router.get('/genres', [GenreController, 'findAll'])

router
  .group(() => {
    router.get(':uuid', [VideoFindController, 'find'])
    router.get('', [VideoFindController, 'findBy'])
    router.get(':uuid/lyrics', [LyricFindController, 'find'])
    router
      .group(() => {
        router.post('', [VideoCreateController, 'create'])
        router.delete(':uuid', [VideoDeleteController, 'delete'])
        router.post(':uuid/lyrics', [LyricSaveController, 'save'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('videos')

router
  .group(() => {
    router.put(':uuid/play', [GameController, 'play'])
    router.get(':uuid/modes', [GameController, 'getModes'])
  })
  .prefix('game')

router
  .group(() => {
    router
      .group(() => {
        router.get('', [FavoriteController, 'findFavoritesByUserLogged'])
        router.post(':uuid', [FavoriteController, 'addFavorite'])
        router.delete(':uuid', [FavoriteController, 'removeFavorite'])
      })
      .prefix('favorites')
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .group(() => {
    router
      .group(() => {
        router.get('', [UserController, 'getFullInfoByUserLogged'])
        router.get('my-lyrics', [VideoUserLoggedController, 'getVideosByUserLogged'])
      })
      .prefix('user')
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
