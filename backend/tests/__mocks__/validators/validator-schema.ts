import { IValidatorSchema } from '#core/domain/validators/ValidatorSchema'

export const validatorSchema: IValidatorSchema<any> = {
  async validateAsync(data) {
    return Promise.resolve(data)
  },
}
