import { MockEntity } from '../Mock/MockEntity';
import { MockNominative } from '../Mock/MockNominative';
import { MockValueObject } from '../Mock/MockValueObject';

describe('Entity', () => {
  describe('equals', () => {
    it('returns true when the ids equal', () => {
      expect.assertions(3);
      const vo1: MockNominative<boolean> = new MockNominative<boolean>(true);
      const vo2: MockNominative<boolean> = new MockNominative<boolean>(false);
      const vo3: MockNominative<boolean> = new MockNominative<boolean>(true);

      const entity1: MockEntity = new MockEntity(vo1, {});
      const entity2: MockEntity = new MockEntity(vo2, {});
      const entity3: MockEntity = new MockEntity(vo3, {});

      expect(entity1.equals(entity1)).toBe(true);
      expect(entity1.equals(entity2)).toBe(false);
      expect(entity1.equals(entity3)).toBe(true);
    });
  });

  describe('hashCode', () => {
    it('returns same value of the hashCode of id', () => {
      expect.assertions(1);
      const vo: MockValueObject = new MockValueObject(undefined);

      const entity: MockEntity = new MockEntity(vo, {});

      expect(vo.hashCode()).toBe(entity.hashCode());
    });

    it('only depends on the id value, even if the other values are changed, returns same hashCode', () => {
      expect.assertions(2);
      const vo: MockValueObject = new MockValueObject(null);

      const entity: MockEntity = new MockEntity(vo, {});
      const code1: string = entity.hashCode();

      entity.other = { code1 };
      const code2: string = entity.hashCode();

      entity.other = {
        code1,
        code2
      };
      const code3: string = entity.hashCode();

      entity.other = {
        code1,
        code2
      };

      expect(code1).toBe(code2);
      expect(code2).toBe(code3);
    });
  });
});
