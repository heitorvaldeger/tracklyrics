import { MailResponse } from '@adonisjs/mail'
import { NodeMailerMessage } from '@adonisjs/mail/types'
import { test } from '@japa/runner'
import nodemailer from 'nodemailer'
import sinon from 'sinon'

import { MailTrapConfig, MailTrapTransport } from '#infra/mail/adonis/mailtrap-transport'

test.group('Mailtrap Transport Nodemailer', (group) => {
  const config: MailTrapConfig = {
    host: 'any_host',
    port: 2525,
    auth: {
      user: 'any_user',
      pass: 'any_pass',
    },
  }

  const message: NodeMailerMessage = {
    from: 'any_from',
    to: ['any_to'],
    subject: 'any_subject',
    text: 'any_text',
  }

  group.each.teardown(() => {
    sinon.restore()
  })

  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })
  test('send an email and return a MailResponse', async ({ expect }) => {
    const sendMailStub = sinon.stub().resolves({
      messageId: 'any_id',
      envelope: { from: 'any_from', to: ['any_to'] },
    })

    const createTransportStub = sinon
      .stub(nodemailer, 'createTransport')
      .returns({ sendMail: sendMailStub } as any)

    const transport = new MailTrapTransport(config)
    const response = await transport.send(message)

    expect(createTransportStub.calledWith(config as any)).toBeTruthy()
    expect(sendMailStub.calledWith(message)).toBeTruthy()
    expect(response).toBeInstanceOf(MailResponse)
    expect(response.messageId).toBe('any_id')
    expect(response.envelope).toEqual({ from: 'any_from', to: ['any_to'] })
  })
})
