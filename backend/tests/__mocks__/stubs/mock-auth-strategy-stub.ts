import { faker } from '@faker-js/faker'
import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/protocols/auth'

type AuthStrategyStub = {
  authStrategyStub: SinonStubbedInstance<Auth>
  uuid: string
}
export const mockAuthStrategy = (): AuthStrategyStub => {
  const uuid = faker.string.uuid()
  const authStrategyStub = createStubInstance(AuthAdonis)
  authStrategyStub.getUserId.returns(1)
  authStrategyStub.getUserEmail.returns('valid_email@mail.com')
  authStrategyStub.getUserUuid.returns(faker.string.uuid())

  return {
    authStrategyStub,
    uuid,
  }
}
