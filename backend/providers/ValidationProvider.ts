import type { ApplicationService } from '@adonisjs/core/types'

import { IRegisterSchema } from '#core/domain/validators/RegisterSchema'
import { ISignInSchema } from '#core/domain/validators/SignInSchema'
import { IUpdatePasswordSchema } from '#core/domain/validators/UpdatePasswordSchema'
import { IValidateEmailSchema } from '#core/domain/validators/ValidateEmailSchema'
import { IValidateUpdatePasswordSchema } from '#core/domain/validators/ValidateUpdatePasswordSchema'
import { RegisterSchemaZod } from '#core/infra/validators/zod/auth/RegisterSchemaZod'
import { SignInSchemaZod } from '#core/infra/validators/zod/auth/SignInSchemaZod'
import { ValidateEmailSchemaZod } from '#core/infra/validators/zod/auth/ValidateEmailSchemaZod'
import { UpdatePasswordSchemaZod } from '#core/infra/validators/zod/user/UpdatePasswordSchemaZod'
import { ValidateUpdatePasswordSchemaZod } from '#core/infra/validators/zod/user/ValidateUpdatePasswordSchemaZod'

export default class ValidationProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const diMap = [
      { protocol: ISignInSchema, implementation: SignInSchemaZod },
      { protocol: IRegisterSchema, implementation: RegisterSchemaZod },
      { protocol: IValidateEmailSchema, implementation: ValidateEmailSchemaZod },
      { protocol: IUpdatePasswordSchema, implementation: UpdatePasswordSchemaZod },
      { protocol: IValidateUpdatePasswordSchema, implementation: ValidateUpdatePasswordSchemaZod },
    ]

    diMap.forEach(({ protocol, implementation }) => {
      this.app.container.bind(protocol, async () => {
        return this.app.container.make(implementation)
      })
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
