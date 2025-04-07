import redis from '@adonisjs/redis/services/main'
import { test } from '@japa/runner'
import { SinonStub, stub } from 'sinon'

import { RedisAdonis } from '#infra/db/cache/redis-adonis'

interface RedisStub {
  set: sinon.SinonStub<[key: string, value: string], Promise<string>>
  get: sinon.SinonStub<[key: string], Promise<string | null>>
  del: sinon.SinonStub<[key: string], Promise<number>>
}
function createRedisStub(): RedisStub {
  return {
    set: stub<[key: string, value: string], Promise<string>>().resolves('OK'),
    get: stub<[key: string], Promise<string | null>>().resolves('any_value'),
    del: stub<[key: string], Promise<number>>().resolves(1), // 1 indica que uma chave foi removida
  }
}

const makeSut = () => {
  const sut = new RedisAdonis()
  return { sut }
}

test.group('Redis Adonis', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  let redisStub: RedisStub

  group.each.setup(() => {
    redisStub = createRedisStub()
  })

  test('set a value with success', async ({ expect }) => {
    const { sut } = makeSut()

    await sut.set('any_key', 'any_value')

    const data = await redisStub.get('any_key')
    expect(data).toBeTruthy()
    expect(data).toBe('any_value')
  })

  test('get a value with success', async ({ expect }) => {
    await redisStub.set('any_key', 'any_value')

    const { sut } = makeSut()

    const data = await sut.get('any_key')

    expect(data).toBeTruthy()
    expect(data).toBe('any_value')
  })

  test('delete a key with success', async ({ expect }) => {
    redisStub.get.resolves(null)
    const { sut } = makeSut()

    await redisStub.set('any_key', 'any_value')
    await sut.delete('any_key')

    const data = await redisStub.get('any_key')
    expect(data).toBeFalsy()
  })
})
