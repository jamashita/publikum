import IORedis from 'ioredis';

import { Nullable } from '@publikum/type';

import { RedisError } from './Error/RedisError';
import { IRedisSet } from './Interface/IRedisSet';

export class RedisSet implements IRedisSet {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async add(key: string, ...values: Array<string>): Promise<number> {
    // prettier-ignore
    try {
      const result: number = await this.client.sadd(key, ...values);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SADD', err);
      }

      throw err;
    }
  }

  public async remove(key: string, ...values: Array<string>): Promise<number> {
    // prettier-ignore
    try {
      const result: number = await this.client.srem(key, ...values);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SREM', err);
      }

      throw err;
    }
  }

  public async has(key: string, value: string): Promise<boolean> {
    // prettier-ignore
    try {
      const result: 0 | 1 = await this.client.sismember(key, value);

      if (result === 0) {
        return false;
      }

      return true;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SISMEMBER', err);
      }

      throw err;
    }
  }

  public async length(key: string): Promise<number> {
    // prettier-ignore
    try {
      const result: number = await this.client.scard(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SCARD', err);
      }

      throw err;
    }
  }

  public async dump(key: string): Promise<Array<string>> {
    // prettier-ignore
    try {
      const result: Array<string> = await this.client.smembers(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SMEMBERS', err);
      }

      throw err;
    }
  }

  public async random(key: string): Promise<Nullable<string>> {
    // prettier-ignore
    try {
      const result: Nullable<string> = await this.client.srandmember(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SRANDMEMBER', err);
      }

      throw err;
    }
  }

  public async pop(key: string): Promise<Nullable<string>> {
    // prettier-ignore
    try {
      const result: Nullable<string> = await this.client.spop(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SPOP', err);
      }

      throw err;
    }
  }
}