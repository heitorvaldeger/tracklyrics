import { UserEmailStatus } from '#enums/user-email-status'
import { createSuccessResponse } from '#helpers/method-response'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'

export const mockAuthServiceStub = (): RegisterProtocolService & AuthProtocolService => ({
  register: (params: RegisterProtocolService.Params) =>
    Promise.resolve(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.UNVERIFIED,
      })
    ),
  login: (params: AuthProtocolService.LoginParams) =>
    Promise.resolve(
      createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    ),
  validateEmail: (params: AuthProtocolService.ValidateEmailParams) =>
    Promise.resolve(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.VERIFIED,
      })
    ),
})
