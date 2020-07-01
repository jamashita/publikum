import { MockError } from '@jamashita/publikum-object';

import { Disappeared } from '../Disappeared';

describe('Disappeared', () => {
  describe('of', () => {
    it('normal case', () => {
      const disappeared: Disappeared<number> = Disappeared.of<number>(new MockError());

      expect(() => {
        disappeared.get();
      }).toThrow(MockError);
    });
  });

  describe('get', () => {
    it('throws the inside error', () => {
      const disappeared: Disappeared<number> = Disappeared.of<number>(new MockError());

      expect(() => {
        disappeared.get();
      }).toThrow(MockError);
    });
  });

  describe('getError', () => {
    it('normal case', () => {
      const error: MockError = new MockError();
      const disappeared: Disappeared<number> = Disappeared.of<number>(error);

      expect(disappeared.getError()).toBe(error);
    });
  });

  describe('isReceived', () => {
    it('always returns false', () => {
      const disappeared1: Disappeared<number> = Disappeared.of<number>(new MockError());
      const disappeared2: Disappeared<number> = Disappeared.of<number>(new MockError());

      expect(disappeared1.isReceived()).toBe(false);
      expect(disappeared2.isReceived()).toBe(false);
    });
  });

  describe('isDisappeared', () => {
    it('always returns true', () => {
      const disappeared1: Disappeared<number> = Disappeared.of<number>(new MockError());
      const disappeared2: Disappeared<number> = Disappeared.of<number>(new MockError());

      expect(disappeared1.isDisappeared()).toBe(true);
      expect(disappeared2.isDisappeared()).toBe(true);
    });
  });
});
