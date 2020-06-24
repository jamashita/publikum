import { Absent } from '../Absent';
import { Present } from '../Present';
import { Quantization } from '../Quantization';

describe('Quantization', () => {
  describe('maybe', () => {
    it('sync present case', async () => {
      expect(await Quantization.maybe(1).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(0).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe('a').get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe('').get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(true).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(false).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Symbol()).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(0n).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(1n).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(-1n).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe({}).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(new Error()).get()).toBeInstanceOf(Present);
    });

    it('sync absent case', async () => {
      expect(await Quantization.maybe(null).get()).toBeInstanceOf(Absent);
      expect(await Quantization.maybe(undefined).get()).toBeInstanceOf(Absent);
    });

    it('async present case', async () => {
      expect(await Quantization.maybe(Promise.resolve(1)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(0)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve('a')).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve('')).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(true)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(false)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(Symbol())).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(0n)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(1n)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(-1n)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve({})).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(new Error())).get()).toBeInstanceOf(Present);
    });

    it('async absent case', async () => {
      expect(await Quantization.maybe(Promise.resolve(null)).get()).toBeInstanceOf(Absent);
      expect(await Quantization.maybe(Promise.resolve(undefined)).get()).toBeInstanceOf(Absent);
    });
  });
});
