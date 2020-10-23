import { MockEntity } from '../Mock/MockEntity';
import { MockValueObject } from '../Mock/MockValueObject';

describe('Entity', () => {
  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const vo: MockValueObject<boolean> = new MockValueObject<boolean>(true);

      const entity: MockEntity<MockValueObject<boolean>> = new MockEntity<MockValueObject<boolean>>(vo, {});

      expect(entity.equals(entity)).toBe(true);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const vo: MockValueObject<boolean> = new MockValueObject<boolean>(true);

      const entity: MockEntity<MockValueObject<boolean>> = new MockEntity<MockValueObject<boolean>>(vo, {});

      expect(entity.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true when the ids equal', () => {
      expect.assertions(2);

      const vo1: MockValueObject<boolean> = new MockValueObject<boolean>(true);
      const vo2: MockValueObject<boolean> = new MockValueObject<boolean>(false);
      const vo3: MockValueObject<boolean> = new MockValueObject<boolean>(true);

      const entity1: MockEntity<MockValueObject<boolean>> = new MockEntity<MockValueObject<boolean>>(vo1, {});
      const entity2: MockEntity<MockValueObject<boolean>> = new MockEntity<MockValueObject<boolean>>(vo2, {});
      const entity3: MockEntity<MockValueObject<boolean>> = new MockEntity<MockValueObject<boolean>>(vo3, {});

      expect(entity1.equals(entity2)).toBe(false);
      expect(entity1.equals(entity3)).toBe(true);
    });
  });

  describe('hashCode', () => {
    it('returns same value of the hashCode of id', () => {
      expect.assertions(1);

      const vo: MockValueObject<undefined> = new MockValueObject<undefined>(undefined);

      const entity: MockEntity<MockValueObject<undefined>> = new MockEntity<MockValueObject<undefined>>(vo, {});

      expect(vo.hashCode()).toBe(entity.hashCode());
    });

    it('only depends on the id value, even if the other values are changed, returns same hashCode', () => {
      expect.assertions(2);

      const vo: MockValueObject<null> = new MockValueObject<null>(null);

      const entity: MockEntity<MockValueObject<null>> = new MockEntity<MockValueObject<null>>(vo, {});
      const code1: string = entity.hashCode();

      entity.setObject({ code1 });
      const code2: string = entity.hashCode();

      entity.setObject({
        code1,
        code2
      });
      const code3: string = entity.hashCode();

      entity.setObject({
        code1,
        code2
      });

      expect(code1).toBe(code2);
      expect(code2).toBe(code3);
    });
  });
});
