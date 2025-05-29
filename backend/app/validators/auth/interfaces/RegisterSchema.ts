export abstract class IRegisterSchema {
  abstract validateAsync(data: any): Promise<{
    email: string
    password: string
    username: string
    firstName: string
    lastName: string
  }>
}
