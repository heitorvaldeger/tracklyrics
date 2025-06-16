export abstract class IOTPAdapter {
  abstract createOTP(id: string): Promise<string>
  abstract validateOTP(token: string): Promise<boolean>
}
