import { inject } from '@adonisjs/core'
import redis from '@adonisjs/redis/services/main'

import { RedisAdapter } from './protocols/redis-adapter.js'

@inject()
export class RedisAdonisAdapter implements RedisAdapter {
  private readonly connection
  constructor() {
    this.connection = redis.connection()
  }

  async set(key: string, value: string): Promise<void> {
    await this.connection.set(key, value)
  }
}
