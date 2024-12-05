import nodemailer from 'nodemailer'

import { MailResponse } from '@adonisjs/mail'
import type {
  NodeMailerMessage,
  MailTransportContract,
  MailManagerTransportFactory,
} from '@adonisjs/mail/types'
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

  private createNodemailerTransport(config: MailTrapConfig) {
    return nodemailer.createTransport(nodemailer.createTransport(config))
  }

  async send(
    message: NodeMailerMessage,
    config?: MailTrapConfig
  ): Promise<MailResponse<SMTPTransport.SentMessageInfo>> {
    /**
     * Create nodemailer transport
     */
    const transporter = this.createNodemailerTransport({
      ...this.config,
      ...config,
    })

    /**
     * Send email
     */
    const response = await transporter.sendMail(message)

    /**
     * Normalize response to an instance of the "MailResponse" class
     */
    return new MailResponse(response.messageId, response.envelope, response)
  }
}

export function mailTrapTransport(config: MailTrapConfig): MailManagerTransportFactory {
  return () => {
    return new MailTrapTransport(config)
  }
}
