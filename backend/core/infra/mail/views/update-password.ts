import { BaseMail } from '@adonisjs/mail'

import env from '#start/env'

export class UpdatePassword extends BaseMail {
  constructor(private readonly params: UpdatePassword.Params) {
    super()
    this.from = env.get('MAIL_FROM')
  }

  subject = 'Update Password - Your Security Code'

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.params.email)
    this.message.text(`Hello ${this.params.username},

    We receive a new request to update your password

    Your OTP code is: ${this.params.codeOTP}
    Please enter this code in the verification field on our website or app.

    This code is valid for 5 minutes. If you did not request this code, please ignore this email.

    If you need assistance, feel free to contact our support team at [support email].

    Best regards,
    The TrackLyrics Team`)
  }
}

namespace UpdatePassword {
  export type Params = {
    username: string
    email: string
    codeOTP: string
  }
}
