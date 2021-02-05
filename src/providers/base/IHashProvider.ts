export default interface IHashProvider {
  createHash(data: string): Promise<string>;
  compareHash(data: string, hash: string): Promise<boolean>;
}
