import { MailResponse } from '@adonisjs/mail'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

import { MailTrapConfig } from '#infra/mail/nodemailer/protocols/mailtrap-config-protocol'
import {
  MailManagerTransportFactory,
  MailTransportContract,
  NodeMailerMessage,
} from '#infra/mail/nodemailer/protocols/nodemailer-protocol'

/**
 * Transport implementation
 */
export class MailTrapTransport implements MailTransportContract {
  constructor(private readonly config: MailTrapConfig) {}

  async send(
    message: NodeMailerMessage,
    config?: MailTrapConfig
  ): Promise<MailResponse<SMTPTransport.SentMessageInfo>> {
    const transporter = nodemailer.createTransport({
      ...config,
      ...this.config,
    })

    const response = await transporter.sendMail(message)

    return new MailResponse(response.messageId, response.envelope, response)
  }
}

export function mailTrapTransport(config: MailTrapConfig): MailManagerTransportFactory {
  return () => {
    return new MailTrapTransport(config)
  }
}
