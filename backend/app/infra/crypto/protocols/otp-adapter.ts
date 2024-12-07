export abstract class OTPAdapter {
  abstract create(id: string): Promise<string>
  abstract validate(token: string): Promise<boolean>
}
