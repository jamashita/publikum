import { Peek } from '@jamashita/publikum-type';

export type CancellableEnumerator<K, V> = (value: V, index: K, cancel: Peek) => void;
