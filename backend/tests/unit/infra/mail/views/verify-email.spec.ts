import { test } from '@japa/runner'

import { VerifyEmail } from '#core/infra/mail/views/verify-email'
import env from '#start/env'

test.group('Verify Email', () => {
  test('it must prepare email for sending', async ({ expect }) => {
    const username = 'any_username'
    const codeOTP = 'any_code'
    const email = 'any_user@mail.com'
    const verifyEmail = new VerifyEmail({
      username,
      email,
      codeOTP,
    })

    /**
     * Build email message and render templates to
     * compute the email HTML and plain text
     * contents
     */
    await verifyEmail.buildWithContents()

    /**
     * Write assertions to ensure the message is built
     * as expected
     */
    verifyEmail.message.assertFrom(env.get('MAIL_FROM'))
    verifyEmail.message.assertSubject('Email Verification - Your Security Code')
    verifyEmail.message.assertTo('any_user@mail.com')
    verifyEmail.message.assertTextIncludes(`Hello ${username},

    Thank you for registering with TrackLyrics! To ensure the security of your account, we need to verify your email address.

    Your OTP code is: ${codeOTP}
    Please enter this code in the verification field on our website or app.

    This code is valid for 10 minutes. If you did not request this code, please ignore this email.

    If you need assistance, feel free to contact our support team at [support email].

    Best regards,
    The TrackLyrics Team`)
  })
})
