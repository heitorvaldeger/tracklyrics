import redis from '@adonisjs/redis/services/main'
import { test } from '@japa/runner'

import { RedisAdonis } from '#infra/db/cache/redis-adonis'

const makeSut = () => {
  const sut = new RedisAdonis()
  return { sut }
}

test.group('Redis Adonis', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('set a value with success', async ({ expect }) => {
    await redis.flushall()
    const { sut } = makeSut()

    await sut.set('any_key', 'any_value')

    const data = await redis.get('any_key')
    expect(data).toBeTruthy()
    expect(data).toBe('any_value')
  })

  test('get a value with success', async ({ expect }) => {
    await redis.flushall()
    await redis.set('any_key', 'any_value')

    const { sut } = makeSut()

    const data = await sut.get('any_key')

    expect(data).toBeTruthy()
    expect(data).toBe('any_value')
  })

  test('delete a key with success', async ({ expect }) => {
    await redis.flushall()
    await redis.set('any_key', 'any_value')

    const { sut } = makeSut()
    await sut.delete('any_key')

    const data = await redis.get('any_key')
    expect(data).toBeFalsy()
  })
})
