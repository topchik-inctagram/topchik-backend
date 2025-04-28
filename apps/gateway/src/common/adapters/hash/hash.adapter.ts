import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class HashAdapter {
  async generatePasswordHash(password: string): Promise<string> {
    return hash(password, 10);
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
