import { test } from '@japa/runner'

import { LanguageLucid } from '#models/language-model/language-lucid'

test.group('Language Routes', (group) => {
  test('/GET languages - it must return 200 on load languages success', async ({
    client,
    expect,
  }) => {
    const languages = await LanguageLucid.createMany([
      {
        name: 'English',
      },
      {
        name: 'Portuguese',
      },
    ])
    const response = await client.get('/languages')

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual(languages.map((language) => language.serialize()))
  })
})
