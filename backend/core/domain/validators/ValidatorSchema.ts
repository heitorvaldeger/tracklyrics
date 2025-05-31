export interface IValidatorSchema<T> {
  validateAsync: (data: any) => Promise<T>
}
