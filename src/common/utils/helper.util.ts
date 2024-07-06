import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export class BaseHelper {
  static generateRandomString(length = 8) {
    return randomBytes(length).toString('hex');
  }

  static async hashData(data: string) {
    return await bcrypt.hash(data, 12);
  }

  static async compareHashedData(data: string, hashed: string) {
    return await bcrypt.compare(data, hashed);
  }

  static generateOTP(): number {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }
}
