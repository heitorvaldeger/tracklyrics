import app from '@adonisjs/core/services/app'
import { defineConfig, stores } from '@adonisjs/session'

import env from '#start/env'

export default defineConfig({
  age: '1y',
  enabled: true,
  cookieName: '@tracklyrics-auth',
  clearWithBrowser: false,

  cookie: {
    path: '/',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },

  store: env.get('SESSION_DRIVER'),
  stores: {
    cookie: stores.cookie(),
    redis: stores.redis({
      connection: 'main',
    }),
  },
})
