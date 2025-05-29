import { IValidatorSchema } from '#validators/interfaces/ValidatorSchema'

export const validatorSchema: IValidatorSchema<any> = {
  async validateAsync(data) {
    return Promise.resolve(data)
  },
}
