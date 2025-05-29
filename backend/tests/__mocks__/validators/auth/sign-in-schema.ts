import { ISignInSchema } from '#validators/auth/interfaces/SignInSchema'

export const signInSchema: ISignInSchema = {
  async validateAsync(data) {
    return Promise.resolve(data)
  },
}
