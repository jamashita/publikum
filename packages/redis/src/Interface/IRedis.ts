import { BinaryFunction } from '@jamashita/publikum-type';
import IORedis from 'ioredis';
import { IRedisHash } from './IRedisHash';
import { IRedisList } from './IRedisList';
import { IRedisSet } from './IRedisSet';
import { IRedisString } from './IRedisString';

export interface IRedis {
  getClient(): IORedis.Redis;

  getHash(): IRedisHash;

  getSet(): IRedisSet;

  getList(): IRedisList;

  getString(): IRedisString;

  delete(...keys: ReadonlyArray<string>): Promise<boolean>;

  exists(...keys: ReadonlyArray<string>): Promise<boolean>;

  expires(key: string, seconds: number): Promise<boolean>;

  subscribe(...channels: ReadonlyArray<string>): Promise<number>;

  unsubscribe(...channels: ReadonlyArray<string>): Promise<number>;

  publish(channel: string, message: string): Promise<number>;

  on(callback: BinaryFunction<string, string, void>): void;
}
