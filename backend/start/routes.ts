/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const LanguageController = () => import('#controllers/language-controller')
const GenreController = () => import('#controllers/genre-controller')
const VideoController = () => import('#controllers/video-controller')

router.get('/languages', [LanguageController, 'findAll'])
router.get('/genres', [GenreController, 'findAll'])
router.get('/videos/:uuid', [VideoController, 'find'])
