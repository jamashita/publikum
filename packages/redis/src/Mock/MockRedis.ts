import IORedis from 'ioredis';

import { UnimplementedError } from '@jamashita/publikum-error';

import { IRedis } from '../Interface/IRedis';
import { IRedisHash } from '../Interface/IRedisHash';
import { IRedisList } from '../Interface/IRedisList';
import { IRedisSet } from '../Interface/IRedisSet';
import { IRedisString } from '../Interface/IRedisString';
import { MockRedisHash } from './MockRedisHash';
import { MockRedisList } from './MockRedisList';
import { MockRedisSet } from './MockRedisSet';
import { MockRedisString } from './MockRedisString';

type MockRedisSetting = Partial<
  Readonly<{
    hash: IRedisHash;
    set: IRedisSet;
    list: IRedisList;
    string: IRedisString;
  }>
>;

export class MockRedis implements IRedis {
  private readonly client: IORedis.Redis;
  private readonly hash: IRedisHash;
  private readonly set: IRedisSet;
  private readonly list: IRedisList;
  private readonly string: IRedisString;

  public constructor({
    hash = new MockRedisHash(),
    set = new MockRedisSet(),
    list = new MockRedisList(),
    string = new MockRedisString()
  }: MockRedisSetting = {}) {
    this.client = new IORedis({});
    this.hash = hash;
    this.set = set;
    this.list = list;
    this.string = string;
  }

  public getClient(): IORedis.Redis {
    return this.client;
  }

  public getHash(): IRedisHash {
    return this.hash;
  }

  public getSet(): IRedisSet {
    return this.set;
  }

  public getList(): IRedisList {
    return this.list;
  }

  public getString(): IRedisString {
    return this.string;
  }

  public delete(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public exists(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public expires(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public subscribe(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public unsubscribe(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public publish(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public on(): void {
    // NOOP
  }
}
