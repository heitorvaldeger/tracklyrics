import { MailResponse } from '@adonisjs/mail'
import type {
  MailManagerTransportFactory,
  MailTransportContract,
  NodeMailerMessage,
} from '@adonisjs/mail/types'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

/**
 * Configuration accepted by the transport
 */
export type MailTrapConfig = {
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
