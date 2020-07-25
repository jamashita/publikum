import { isNominative, Nominative } from '../Nominative';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      expect(isNominative<MockNominative>(null)).toBe(false);
      expect(isNominative<MockNominative>(undefined)).toBe(false);
      expect(isNominative<MockNominative>('')).toBe(false);
      expect(isNominative<MockNominative>('123')).toBe(false);
      expect(isNominative<MockNominative>('abcd')).toBe(false);
      expect(isNominative<MockNominative>(123)).toBe(false);
      expect(isNominative<MockNominative>(0)).toBe(false);
      expect(isNominative<MockNominative>(false)).toBe(false);
      expect(isNominative<MockNominative>(true)).toBe(false);
      expect(isNominative<MockNominative>(Symbol())).toBe(false);
      expect(isNominative<MockNominative>(20n)).toBe(false);
      expect(isNominative<MockNominative>({})).toBe(false);
      expect(isNominative<MockNominative>([])).toBe(false);
      expect(
        isNominative<MockNominative>({
          noun: 'que'
        })
      ).toBe(false);
      expect(
        isNominative<MockNominative>({
          noun: 'que',
          equals() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isNominative<MockNominative>({
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
        isNominative<MockNominative>({
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
      expect(isNominative<MockNominative>(new MockNominative())).toBe(true);
    });
  });
});
