import { faker } from '@faker-js/faker'
import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

type AuthStrategyStub = {
  authStrategyStub: SinonStubbedInstance<AuthStrategy>
  uuid: string
}
export const mockAuthStrategyStub = (): AuthStrategyStub => {
  const uuid = faker.string.uuid()
  const authStrategyStub = createStubInstance(AuthAdonisStrategy)
  authStrategyStub.getUserId.returns(1)
  authStrategyStub.getUserEmail.returns('valid_email@mail.com')
  authStrategyStub.getUserUuid.returns(faker.string.uuid())

  return {
    authStrategyStub,
    uuid,
  }
}
