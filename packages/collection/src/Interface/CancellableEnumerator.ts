export type CancellableEnumerator<K, V> = (value: V, index: K) => boolean | void;
