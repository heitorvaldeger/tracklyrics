import { defineConfig } from '@adonisjs/lucid'
import { DateTime } from 'luxon'
import pg from 'pg'

import env from '#start/env'

pg.types.setTypeParser(pg.types.builtins.INT8, Number.parseInt)
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number.parseFloat)
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => {
  return DateTime.fromSQL(value).setZone('UTC').toSQLDate()
})
const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
