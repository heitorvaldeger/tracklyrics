import sinon from 'sinon'

import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'

export const mockAuthStrategy = () => {
  const authStrategyStub = sinon.createStubInstance(AuthAdonisStrategy)
  authStrategyStub.getUserId.returns(1)

  return authStrategyStub
}
