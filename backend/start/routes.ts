/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const GenrerController = () => import('#controllers/GenrerController')
const VideoController = () => import('#controllers/VideoController')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/test/:genrerId', [VideoController, 'findByGenrer'])
router.get('/test2/:uuid', [VideoController, 'find'])
