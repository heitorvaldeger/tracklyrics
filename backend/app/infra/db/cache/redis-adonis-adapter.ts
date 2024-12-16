import { inject } from '@adonisjs/core'
import redis from '@adonisjs/redis/services/main'

import { CacheAdapter } from './protocols/cache-adapter.js'

@inject()
export class RedisAdonisAdapter implements CacheAdapter {
  private readonly connection
  constructor() {
    this.connection = redis.connection()
  }

  async set(key: string, value: string): Promise<void> {
    await this.connection.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return await this.connection.get(key)
  }
}
