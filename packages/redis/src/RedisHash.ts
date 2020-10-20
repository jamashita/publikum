import { Nullable } from '@jamashita/publikum-type';
import IORedis from 'ioredis';
import { RedisError } from './Error/RedisError';
import { IRedisHash } from './Interface/IRedisHash';

export class RedisHash implements IRedisHash {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async set(key: string, field: string, value: string): Promise<boolean> {
    try {
      await this.client.hset(key, field, value);

      return true;
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON HSET', err);
      }

      throw err;
    }
  }

  public async get(key: string, field: string): Promise<Nullable<string>> {
    try {
      return await this.client.hget(key, field);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON HGET', err);
      }

      throw err;
    }
  }

  public async delete(key: string, field: string): Promise<number> {
    try {
      return await this.client.hdel(key, field);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON HDEL', err);
      }

      throw err;
    }
  }

  public async length(key: string): Promise<number> {
    try {
      return await this.client.hlen(key);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON HLEN', err);
      }

      throw err;
    }
  }

  public async has(key: string, field: string): Promise<boolean> {
    try {
      const result: 0 | 1 = await this.client.hexists(key, field);

      if (result === 0) {
        return false;
      }

      return true;
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON HEXISTS', err);
      }

      throw err;
    }
  }
}
