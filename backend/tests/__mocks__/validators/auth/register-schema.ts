import { IRegisterSchema } from '#validators/auth/interfaces/RegisterSchema'

export const registerSchema: IRegisterSchema = {
  async validateAsync(data) {
    return Promise.resolve(data)
  },
}
