import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { apiClient } from '@japa/api-client'
import { expect } from '@japa/expect'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import type { Config } from '@japa/runner/types'
import Sinon from 'sinon'

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
  setup: [
    () => {
      mail.fake()
    },
  ],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  suite.onGroup((group) => {
    group.each.setup(async () => {
      Sinon.reset()
      Sinon.restore()

      await db.from('lyrics').del()
      await db.from('favorites').del()
      await db.from('video_play_counts').del()
      await db.from('videos').del()
      await db.from('users').del()
      await db.from('genres').del()
      await db.from('languages').del()
    })
  })

  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}

export const reporters: Config['reporters'] = {
  activated: ['spec'],
}
