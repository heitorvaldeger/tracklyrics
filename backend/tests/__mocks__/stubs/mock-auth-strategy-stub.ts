import { faker } from '@faker-js/faker'
import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/protocols/auth'

type AuthStrategyStub = {
  authStub: SinonStubbedInstance<Auth>
  uuid: string
}
export const mockAuth = (): AuthStrategyStub => {
  const uuid = faker.string.uuid()
  const authStub = createStubInstance(AuthAdonis)
  authStub.getUserId.returns(1)
  authStub.getUserEmail.returns('valid_email@mail.com')
  authStub.getUserUuid.returns(faker.string.uuid())

  return {
    authStub,
    uuid,
  }
}
