import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import mail from '@adonisjs/mail/services/main'
import { apiClient } from '@japa/api-client'
import { expect } from '@japa/expect'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import type { Config } from '@japa/runner/types'
import Sinon from 'sinon'

import FavoriteLucid from '#models/favorite-model/favorite-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [apiClient(), pluginAdonisJS(app), expect()]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  suite.onGroup((group) => {
    group.tap((test) => {
      test.setup(async () => {
        mail.fake()
        Sinon.reset()
        Sinon.restore()
        await FavoriteLucid.query().del()
        await VideoLucid.query().del()
        await UserLucid.query().del()
        await GenreLucid.query().del()
        await LanguageLucid.query().del()
      })
    })
  })

  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}

export const reporters: Config['reporters'] = {
  activated: ['spec'],
}
