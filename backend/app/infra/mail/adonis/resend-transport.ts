import { MailResponse } from '@adonisjs/mail'
import { MailTransportContract, NodeMailerMessage, ResponseEnvelope } from '@adonisjs/mail/types'
import { Resend } from 'resend'

export class ResendMailTransport implements MailTransportContract {
  private readonly resend: Resend

  constructor(private readonly apiKey: string) {
    this.resend = new Resend(apiKey)
  }

  async send(message: NodeMailerMessage): Promise<MailResponse<any>> {
    const response = await this.resend.emails.send({
      from: message.from?.toString() ?? '',
      to: message.to?.toString() ?? '',
      subject: message.subject?.toString() ?? '',
      text: message.text?.toString() ?? '',
      html: message.html?.toString() ?? '',
    })

    const envelope: ResponseEnvelope = {
      from: '',
      to: [''],
    }

    return new MailResponse(response.data?.id ?? '', envelope, response)
  }
}

export const resendMailTransport = (apiKey: string) => () => new ResendMailTransport(apiKey)
