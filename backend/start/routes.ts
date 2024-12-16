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
const FavoriteController = () => import('#controllers/favorite-controller')

const LanguageController = () => import('#controllers/language-controller')
const GenreController = () => import('#controllers/genre-controller')
const VideoFindController = () => import('#controllers/video/video-find-controller')
const VideoCreateController = () => import('#controllers/video/video-create-controller')
const VideoDeleteController = () => import('#controllers/video/video-delete-controller')
const AuthController = () => import('#controllers/auth-controller')

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/validate-email', [AuthController, 'validateEmail'])
router.get('/languages', [LanguageController, 'findAll'])
router.get('/genres', [GenreController, 'findAll'])
router.get('/videos/:uuid', [VideoFindController, 'find'])
router.get('/videos', [VideoFindController, 'findBy'])
router
  .group(() => {
    router
      .group(() => {
        router.post('', [VideoCreateController, 'create'])
        router.delete(':uuid', [VideoDeleteController, 'delete'])
      })
      .prefix('videos')

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
