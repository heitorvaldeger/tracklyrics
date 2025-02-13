import { BaseSeeder } from '@adonisjs/lucid/seeders'

import { LanguageLucid } from '#models/language-model/language-lucid'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    const uniqueKey = 'id'

    await LanguageLucid.updateOrCreateMany(uniqueKey, [
      { id: 1, name: 'English', flagCountry: 'us' },
      { id: 2, name: 'Spanish', flagCountry: 'es' },
      { id: 3, name: 'Portuguese', flagCountry: 'br' },
      { id: 4, name: 'French', flagCountry: 'fr' },
      { id: 5, name: 'Italian', flagCountry: 'it' },
      { id: 6, name: 'German', flagCountry: 'de' },
      { id: 7, name: 'Dutch', flagCountry: 'nl' },
      { id: 8, name: 'Japanese (Romaji)', flagCountry: 'jp' },
      { id: 9, name: 'Turkish', flagCountry: 'tr' },
      { id: 10, name: 'Polish', flagCountry: 'pl' },
      { id: 11, name: 'Swedish', flagCountry: 'se' },
      { id: 12, name: 'Finnish', flagCountry: 'fi' },
    ])
  }
}
