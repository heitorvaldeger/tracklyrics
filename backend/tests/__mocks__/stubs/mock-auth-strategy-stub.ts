import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

export const mockAuthStrategyStub = (): SinonStubbedInstance<AuthStrategy> => {
  const authStrategyStub = createStubInstance(AuthAdonisStrategy)
  authStrategyStub.getUserId.returns(1)
  authStrategyStub.getUserEmail.returns('valid_email@mail.com')

  return authStrategyStub
}
