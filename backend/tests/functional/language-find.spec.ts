import { LanguageLucid } from '#models/language-model/language-lucid'
import { test } from '@japa/runner'

test.group('Language Routes', (group) => {
  test('/GET languages - should return 200 on load languages success', async ({
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
