import { Nullable } from '@jamashita/publikum-type';
import IORedis from 'ioredis';
import { RedisError } from './Error/RedisError';
import { IRedisSet } from './Interface/IRedisSet';

export class RedisSet implements IRedisSet {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async add(key: string, ...values: Array<string>): Promise<number> {
    try {
      return await this.client.sadd(key, ...values);
    }
    catch (err) {
      throw new RedisError('FAIL ON SADD', err);
    }
  }

  public async remove(key: string, ...values: Array<string>): Promise<number> {
    try {
      return await this.client.srem(key, ...values);
    }
    catch (err) {
      throw new RedisError('FAIL ON SREM', err);
    }
  }

  public async has(key: string, value: string): Promise<boolean> {
    try {
      const result: 0 | 1 = await this.client.sismember(key, value);

      if (result === 0) {
        return false;
      }

      return true;
    }
    catch (err) {
      throw new RedisError('FAIL ON SISMEMBER', err);
    }
  }

  public async length(key: string): Promise<number> {
    try {
      return await this.client.scard(key);
    }
    catch (err) {
      throw new RedisError('FAIL ON SCARD', err);
    }
  }

  public async dump(key: string): Promise<Array<string>> {
    try {
      return await this.client.smembers(key);
    }
    catch (err) {
      throw new RedisError('FAIL ON SMEMBERS', err);
    }
  }

  public async random(key: string): Promise<Nullable<string>> {
    try {
      return await this.client.srandmember(key);
    }
    catch (err) {
      throw new RedisError('FAIL ON SRANDMEMBER', err);
    }
  }

  public async pop(key: string): Promise<Nullable<string>> {
    try {
      return await this.client.spop(key);
    }
    catch (err) {
      throw new RedisError('FAIL ON SPOP', err);
    }
  }
}
