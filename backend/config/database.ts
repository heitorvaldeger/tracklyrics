import env from '#start/env'
import pg from 'pg'
import { defineConfig } from '@adonisjs/lucid'

pg.types.setTypeParser(pg.types.builtins.INT8, Number.parseInt)
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number.parseFloat)

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
