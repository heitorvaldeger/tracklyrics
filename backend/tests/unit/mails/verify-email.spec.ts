import { test } from '@japa/runner'

import { VerifyEmail } from '#mails/verify-email'

test.group('Verify Email', () => {
  test('should prepare email for sending', async ({ expect }) => {
    const username = 'any_username'
    const codeOTP = 'any_code'
    const email = new VerifyEmail({
      username,
      codeOTP,
    })

    /**
     * Build email message and render templates to
     * compute the email HTML and plain text
     * contents
     */
    await email.buildWithContents()

    /**
     * Write assertions to ensure the message is built
     * as expected
     */
    email.message.assertFrom('no-reply@tracklyrics.com')
    email.message.assertSubject('Email Verification - Your Security Code')
    email.message.assertTextIncludes(`Hello ${username},

    Thank you for registering with [Company/Platform Name]! To ensure the security of your account, we need to verify your email address.

    Your OTP code is: ${codeOTP}
    Please enter this code in the verification field on our website or app.

    This code is valid for 10 minutes. If you did not request this code, please ignore this email.

    If you need assistance, feel free to contact our support team at [support email].

    Best regards,
    The [Company Name] Team`)
  })
})
