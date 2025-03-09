export abstract class HashAdapter {
  abstract createHash(value: string): Promise<string>
  abstract validateHash(hashedValue: string, plainValue: string): Promise<boolean>
}
