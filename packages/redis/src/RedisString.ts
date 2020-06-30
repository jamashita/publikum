import IORedis from 'ioredis';

import { Nullable } from '@jamashita/publikum-type';

import { RedisError } from './Error/RedisError';
import { IRedisString } from './Interface/IRedisString';

export class RedisString implements IRedisString {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async set(key: string, value: string): Promise<boolean> {
    // prettier-ignore
    try {
      const result: string = await this.client.set(key, value);

      if (result === 'OK') {
        return true;
      }

      return false;
    }
    catch (err) {
      throw new RedisError('FAIL ON SET', err);
    }
  }

  public async get(key: string): Promise<Nullable<string>> {
    // prettier-ignore
    try {
      return await this.client.get(key);
    }
    catch (err) {
      throw new RedisError('FAIL ON GET', err);
    }
  }
}
