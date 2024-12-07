import { BaseMail } from '@adonisjs/mail'

import env from '#start/env'

export class VerifyEmail extends BaseMail {
  constructor(private readonly params: VerifyEmail.Params) {
    super()
    this.from = env.get('MAILTRAP_FROM')
  }

  subject = 'Email Verification - Your Security Code'

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.text(`Hello ${this.params.username},

    Thank you for registering with [Company/Platform Name]! To ensure the security of your account, we need to verify your email address.

    Your OTP code is: ${this.params.codeOTP}
    Please enter this code in the verification field on our website or app.

    This code is valid for 10 minutes. If you did not request this code, please ignore this email.

    If you need assistance, feel free to contact our support team at [support email].

    Best regards,
    The [Company Name] Team`)
  }
}

namespace VerifyEmail {
  export type Params = {
    username: string
    codeOTP: string
  }
}
