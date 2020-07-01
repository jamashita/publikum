import { Received } from '../Received';

describe('Received', () => {
  describe('of', () => {
    it('normal case', () => {
      const value: number = 113;
      const received: Received<number> = Received.of<number>(value);

      expect(received.get()).toBe(value);
    });
  });

  describe('get', () => {
    it('returns the inside value', () => {
      const value: string = 'the lazy fox';
      const received: Received<string> = Received.of<string>(value);

      expect(received.get()).toBe(value);
    });
  });

  describe('isReceived', () => {
    it('always returns true', () => {
      const value1: number = 1;
      const value2: string = 'aiutare';
      const received1: Received<number> = Received.of<number>(value1);
      const received2: Received<string> = Received.of<string>(value2);

      expect(received1.isReceived()).toBe(true);
      expect(received1.get()).toBe(value1);
      expect(received2.isReceived()).toBe(true);
      expect(received2.get()).toBe(value2);
    });
  });

  describe('isDisappeared', () => {
    it('always returns false', () => {
      const received1: Received<number> = Received.of<number>(1);
      const received2: Received<string> = Received.of<string>('aiutare');

      expect(received1.isDisappeared()).toBe(false);
      expect(received2.isDisappeared()).toBe(false);
    });
  });
});
