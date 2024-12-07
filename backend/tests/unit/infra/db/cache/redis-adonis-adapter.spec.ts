import redis from '@adonisjs/redis/services/main'
import { test } from '@japa/runner'

import { RedisAdonisAdapter } from '#infra/db/cache/redis-adonis-adapter'

const makeSut = () => {
  const sut = new RedisAdonisAdapter()
  return { sut }
}

test.group('Redis Adonis', () => {
  test('should set a value with success', async ({ expect }) => {
    await redis.flushall()
    const { sut } = makeSut()

    await sut.set('any_key', 'any_value')

    const data = await redis.get('any_key')
    expect(data).toBeTruthy()
    expect(data).toBe('any_value')
  })
})
