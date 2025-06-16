import { inject } from '@adonisjs/core'
import redis from '@adonisjs/redis/services/main'

import { ICacheAdapter } from './interfaces/cache-adapter.js'

@inject()
export class RedisAdonis implements ICacheAdapter {
  private readonly connection
  constructor() {
    this.connection = redis.connection()
  }

  async set(key: string, value: string, ttl: number = 60): Promise<void> {
    await this.connection.set(key, value, 'EX', ttl)
  }

  async get(key: string): Promise<string | null> {
    return await this.connection.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.connection.del([key])
  }
}
