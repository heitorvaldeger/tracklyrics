import type { ApplicationService } from '@adonisjs/core/types'

import { IFindByVideoSchema } from '#core/domain/validators/FindByVideoSchema'
import { IGetGameSchema } from '#core/domain/validators/GetGameSchema'
import { IRegisterSchema } from '#core/domain/validators/RegisterSchema'
import { ISaveVideoSchema } from '#core/domain/validators/SaveVideoSchema'
import { ISignInSchema } from '#core/domain/validators/SignInSchema'
import { IUpdatePasswordSchema } from '#core/domain/validators/UpdatePasswordSchema'
import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { IValidateEmailSchema } from '#core/domain/validators/ValidateEmailSchema'
import { IValidateUpdatePasswordSchema } from '#core/domain/validators/ValidateUpdatePasswordSchema'
import { RegisterSchemaZod } from '#core/infra/validators/zod/auth/RegisterSchemaZod'
import { SignInSchemaZod } from '#core/infra/validators/zod/auth/SignInSchemaZod'
import { ValidateEmailSchemaZod } from '#core/infra/validators/zod/auth/ValidateEmailSchemaZod'
import { GetGameSchemaZod } from '#core/infra/validators/zod/GetGameSchemaZod'
import { UpdatePasswordSchemaZod } from '#core/infra/validators/zod/user/UpdatePasswordSchemaZod'
import { ValidateUpdatePasswordSchemaZod } from '#core/infra/validators/zod/user/ValidateUpdatePasswordSchemaZod'
import { UUIDValidatorSchemaZod } from '#core/infra/validators/zod/UUIDValidatorSchemaZod'
import { FindByVideoSchemaZod } from '#core/infra/validators/zod/video/FindByVideoSchemaZod'
import { SaveVideoSchemaZod } from '#core/infra/validators/zod/video/SaveVideoSchemaZod'

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
      { protocol: IUUIDValidatorSchema, implementation: UUIDValidatorSchemaZod },
      { protocol: IFindByVideoSchema, implementation: FindByVideoSchemaZod },
      { protocol: IGetGameSchema, implementation: GetGameSchemaZod },
      { protocol: ISaveVideoSchema, implementation: SaveVideoSchemaZod },
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
