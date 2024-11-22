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
const GenrerController = () => import('#controllers/genrer-controller')
const VideoController = () => import('#controllers/video-controller')

router.get('/languages', [LanguageController, 'findAll'])
router.get('/genrers', [GenrerController, 'findAll'])
router.get('/videos/:uuid', [VideoController, 'find'])
