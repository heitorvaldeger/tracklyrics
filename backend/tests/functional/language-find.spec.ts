import { test } from '@japa/runner'

import { Language } from '#models/language'

test.group('Language Routes', (group) => {
  test('/GET languages - it must return 200 on load languages success', async ({
    client,
    expect,
  }) => {
    const languages = (
      await Language.createMany([
        {
          name: 'English',
          flagCountry: 'US',
        },
        {
          name: 'Portuguese',
          flagCountry: 'BR',
        },
      ])
    ).map((language) => language.serialize())
    const response = await client.get('/languages')

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual(languages)
  })
})
