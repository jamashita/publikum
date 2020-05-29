import { Nullable } from '@jamashita/publikum/type';

export interface IRedisString {
  set(key: string, value: string): Promise<boolean>;

  get(key: string): Promise<Nullable<string>>;
}
