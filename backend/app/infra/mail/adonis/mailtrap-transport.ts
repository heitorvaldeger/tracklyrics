import { MailResponse } from '@adonisjs/mail'
import {
  MailManagerTransportFactory,
  MailTransportContract,
  NodeMailerMessage,
} from '@adonisjs/mail/types'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

export interface MailTrapConfig {
  host: string
  port: number
  auth: {
    user: string
    pass: string
  }
}

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
  (config: MailTrapConfig): MailManagerTransportFactory =>
  () =>
    new MailTrapTransport({
      ...config,
    })
