import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { Language } from '#models/language'
import { toCamelCase } from '#utils/index'

test.group('Language Routes', (group) => {
  test('/GET languages - it must return 200 on load languages success', async ({
    client,
    expect,
  }) => {
    const languages = (await db
      .table('languages')
      .returning(['id', 'name', 'flag_country'])
      .insert([
        {
          name: 'English',
          flag_country: 'US',
        },
        {
          name: 'Portuguese',
          flag_country: 'BR',
        },
      ])) as Language[]
    const response = await client.get('/languages')

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual(languages.map(toCamelCase))
  })
})
