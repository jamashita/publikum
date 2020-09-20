import { isNominative, Nominative } from '../Nominative';

class MockNominative implements Nominative<MockNominative> {
  public readonly noun: string = 'momo';

  public equals(other: MockNominative): boolean {
    return this === other;
  }

  public hashCode(): string {
    return 'pio';
  }

  public serialize(): string {
    return 'uhu';
  }
}

describe('Nominative', () => {
  describe('isNominative', () => {
    it('normal case', () => {
      expect.assertions(18);

      expect(isNominative(null)).toBe(false);
      expect(isNominative(undefined)).toBe(false);
      expect(isNominative('')).toBe(false);
      expect(isNominative('123')).toBe(false);
      expect(isNominative('abcd')).toBe(false);
      expect(isNominative(123)).toBe(false);
      expect(isNominative(0)).toBe(false);
      expect(isNominative(false)).toBe(false);
      expect(isNominative(true)).toBe(false);
      expect(isNominative(Symbol())).toBe(false);
      expect(isNominative(20n)).toBe(false);
      expect(isNominative({})).toBe(false);
      expect(isNominative([])).toBe(false);
      expect(
        isNominative({
          noun: 'que'
        })
      ).toBe(false);
      expect(
        isNominative({
          noun: 'que',
          equals() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isNominative({
          noun: 'que',
          equals() {
            // NOOP
          },
          hashCode() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isNominative({
          noun: 'que',
          equals() {
            // NOOP
          },
          hashCode() {
            // NOOP
          },
          serialize() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isNominative(new MockNominative())).toBe(true);
    });
  });
});
