import { defineConfig } from '@adonisjs/mail'

import { mailTrapTransport } from '#core/infra/mail/adonis/mailtrap-transport'
import { resendMailTransport } from '#core/infra/mail/adonis/resend-transport'
import env from '#start/env'

const mailConfig = defineConfig({
  default: 'resend',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    mailTrap: mailTrapTransport({
      host: env.get('MAILTRAP_HOST'),
      port: env.get('MAILTRAP_PORT'),
      auth: {
        user: env.get('MAILTRAP_USER'),
        pass: env.get('MAILTRAP_PASS'),
      },
    }),
    resend: resendMailTransport(env.get('RESEND_API_KEY') ?? ''),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
