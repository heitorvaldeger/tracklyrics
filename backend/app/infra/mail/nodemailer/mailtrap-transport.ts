import { MailResponse } from '@adonisjs/mail'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

import {
  MailManagerTransportFactory,
  MailTransportContract,
  NodeMailerMessage,
} from '#infra/mail/nodemailer/protocols/nodemailer-protocol'

/**
 * Transport implementation
 */
export class MailTrapTransport implements MailTransportContract {
  constructor(private readonly config: MailTrapTransport.Config) {}

  async send(
    message: NodeMailerMessage,
    config?: MailTrapTransport.Config
  ): Promise<MailResponse<SMTPTransport.SentMessageInfo>> {
    const transporter = nodemailer.createTransport({
      ...this.config,
      ...config,
    })

    const response = await transporter.sendMail({
      ...message,
    })

    return new MailResponse(response.messageId, response.envelope, response)
  }
}

export const mailTrapTransport =
  (config: MailTrapTransport.Config): MailManagerTransportFactory =>
  () =>
    new MailTrapTransport({
      ...config,
    })

export namespace MailTrapTransport {
  export type Config = {
    host: string
    port: number
    auth: {
      user: string
      pass: string
    }
  }
}
