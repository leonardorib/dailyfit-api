import bcrypt from 'bcryptjs';
import IHashProvider from './base/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  public async createHash(data: string): Promise<string> {
    return bcrypt.hash(data, 8);
  }

  public async compareHash(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
