import { Digest } from '../Digest';

describe('Digest', () => {
  describe('generate', () => {
    it('generates different hashes', async () => {
      expect.assertions(1);

      const password: string = 'The quick brown fox jumps over the lazy dog';
      const [hash1, hash2]: [string, string] = await Promise.all([
        Digest.generate(password),
        Digest.generate(password)
      ]);

      expect(hash1).not.toBe(hash2);
    }, 30_000);
  });

  describe('compare', () => {
    it('returns true even if the hashes are different', async () => {
      expect.assertions(2);

      const password: string = 'The quick brown fox jumps over the lazy dog';
      const hash1: string = await Digest.generate(password);
      const hash2: string = await Digest.generate(password);

      const [compared1, compared2]: [boolean, boolean] = await Promise.all([
        Digest.compare(password, hash1),
        Digest.compare(password, hash2)
      ]);

      expect(compared1).toBe(true);
      expect(compared2).toBe(true);
    }, 30_000);
  });
});
