import { test } from '@japa/runner'

test.group('Example', () => {
  test('example test', async ({ assert }) => {
    assert.equal(1, 2)
  })
})
