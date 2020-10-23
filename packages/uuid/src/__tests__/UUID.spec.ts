import { MockValueObject } from '@jamashita/publikum-object';
import { UUIDError } from '../Error/UUIDError';
import { UUID } from '../UUID';

describe('UUID', () => {
  describe('of', () => {
    it('returns instance', () => {
      expect.assertions(1);

      const uuid: string = '998106de-b2e7-4981-9643-22cd30cd74de';

      expect(UUID.of(uuid).get()).toBe(uuid);
    });

    it('throws UUIDError when the argument is not satisfied UUID format', () => {
      expect.assertions(1);

      expect(() => {
        UUID.of('cinq');
      }).toThrow(UUIDError);
    });
  });

  describe('size', () => {
    it('returns 36', () => {
      expect.assertions(1);

      expect(UUID.size()).toStrictEqual(36);
    });
  });

  describe('isAcceptable', () => {
    it('returns true if given string is not violated to uuid format', () => {
      expect.assertions(1);

      const uuid: string = '998106de-b2e7-4981-9643-22cd30cd74de';

      expect(UUID.isAcceptable(uuid)).toBe(true);
    });

    it('generates UUID that must pass', () => {
      expect.assertions(200);

      for (let i: number = 0; i < 100; i++) {
        expect(UUID.isAcceptable(UUID.v4().get())).toBe(true);
        expect(UUID.isAcceptable(UUID.v5().get())).toBe(true);
      }
    });
  });

  describe('v4', () => {
    it('always generates 36 length string', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        const v4: UUID = UUID.v4();

        expect(v4.get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('v5', () => {
    it('always generates 36 length string', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        const v5: UUID = UUID.v5();

        expect(v5.get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(uuid1.equals(uuid1)).toBe(true);
    });

    it('returns false if different class instance given', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(uuid1.equals(new MockValueObject('998106de-b2e7-4981-9643-22cd30cd74de'))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      expect.assertions(2);

      const uuid1: UUID = UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const uuid2: UUID = UUID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9');
      const uuid3: UUID = UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(uuid1.equals(uuid2)).toBe(false);
      expect(uuid1.equals(uuid3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const uuid: UUID = UUID.of(id);

      expect(uuid.toString()).toBe(id);
    });
  });
});
