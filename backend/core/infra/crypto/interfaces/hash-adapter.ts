export abstract class IHashAdapter {
  abstract createHash(value: string): Promise<string>
  abstract validateHash(hashedValue: string, plainValue: string): Promise<boolean>
}
