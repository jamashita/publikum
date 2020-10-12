import cryptoRandomString from 'crypto-random-string';
import { randomInt } from 'd3-random';

export class Random {
  public static string(length: number, pool?: string): string {
    return cryptoRandomString({
      length,
      characters: pool
    });
  }

  public static integer(min: number, max: number): number {
    return randomInt(min, max)();
  }

  private constructor() {
    // NOOP
  }
}
