import env from '#start/env'
import pg from 'pg'
import { defineConfig } from '@adonisjs/lucid'

// The OID 20 corresponds the 'bigint' type on PostgresSQL
const BIGINT_OID = 20

pg.types.setTypeParser(BIGINT_OID, (val) => {
  if (val === null) {
    return null
  }

  const num = Number.parseInt(val, 10)

  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    throw new Error(`BigInt value is out of secure range to Number: ${val}`)
  }

  return num
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
