// eslint-disable-next-line max-classes-per-file
import { randomBytes } from 'crypto';
import { ValidationError } from '../../Error/ValidationError';
import { ValidationRule } from '../../Interface/ValidationRule';
import { addRule, Validate } from '../Validate';

const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const random = (length: number): Promise<string> => {
  const charLength: number = chars.length;

  return new Promise<string>((resolve: (value: (string)) => void, reject: (reason?: unknown) => void) => {
    randomBytes(length, (err: Error | null, buf: Buffer) => {
      if (err !== null) {
        reject(err);

        return;
      }

      const str: string = buf.reduce<string>((p: string, i: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return `${p}${chars[i % charLength]!}`;
      }, '');

      resolve(str);
    });
  });
};

type TestValidationArgs = Readonly<{
  throwError: boolean;
}>;

class TestValidationRule implements ValidationRule {
  private readonly throwError: boolean;

  public constructor({ throwError }: TestValidationArgs) {
    this.throwError = throwError;
  }

  public evaluate(): void {
    if (this.throwError) {
      throw new ValidationError('ERROR!');
    }
  }
}

const TestValidation = (args: TestValidationArgs): ParameterDecorator => {
  const v: TestValidationRule = new TestValidationRule(args);

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};

class Test1 {
  @Validate()
  public oneA(
    @TestValidation({ throwError: false }) arg1: unknown
  ): unknown {
    return arg1;
  }

  @Validate()
  public twoA(
    @TestValidation({ throwError: false }) _arg1: unknown,
    @TestValidation({ throwError: false }) arg2: unknown
  ): unknown {
    return arg2;
  }

  @Validate()
  public threeA(
    @TestValidation({ throwError: false }) _arg1: unknown,
    @TestValidation({ throwError: false }) _arg2: unknown,
    @TestValidation({ throwError: false }) arg3: unknown
  ): unknown {
    return arg3;
  }
}

class Test2 {
  @Validate()
  public oneA(
    @TestValidation({ throwError: true }) arg1: unknown
  ): unknown {
    return arg1;
  }

  @Validate()
  public twoA(
    @TestValidation({ throwError: true }) _arg1: unknown,
    @TestValidation({ throwError: false }) arg2: unknown
  ): unknown {
    return arg2;
  }

  @Validate()
  public threeA(
    @TestValidation({ throwError: true }) _arg1: unknown,
    @TestValidation({ throwError: false }) _arg2: unknown,
    @TestValidation({ throwError: false }) arg3: unknown
  ): unknown {
    return arg3;
  }
}

class Test3 {
  @Validate()
  public oneA(
    @TestValidation({ throwError: true }) arg1: unknown
  ): unknown {
    return arg1;
  }

  @Validate()
  public twoA(
    @TestValidation({ throwError: false }) _arg1: unknown,
    @TestValidation({ throwError: true }) arg2: unknown
  ): unknown {
    return arg2;
  }

  @Validate()
  public threeA(
    @TestValidation({ throwError: false }) _arg1: unknown,
    @TestValidation({ throwError: false }) _arg2: unknown,
    @TestValidation({ throwError: true }) arg3: unknown
  ): unknown {
    return arg3;
  }
}

class Test4 {
  @Validate()
  public oneA(
    @TestValidation({ throwError: true }) arg1: unknown
  ): unknown {
    return arg1;
  }

  @Validate()
  public twoA(
    @TestValidation({ throwError: true }) _arg1: unknown,
    @TestValidation({ throwError: true }) arg2: unknown
  ): unknown {
    return arg2;
  }

  @Validate()
  public threeA(
    @TestValidation({ throwError: true }) _arg1: unknown,
    @TestValidation({ throwError: true }) _arg2: unknown,
    @TestValidation({ throwError: true }) arg3: unknown
  ): unknown {
    return arg3;
  }
}

describe('Validate', () => {
  it('will not throw ValueError when any decorated args are not set to throw ValueError', () => {
    expect.assertions(3);

    const test: Test1 = new Test1();

    expect(() => {
      test.oneA('');
    }).not.toThrow(ValidationError);
    expect(() => {
      test.twoA('', '');
    }).not.toThrow(ValidationError);
    expect(() => {
      test.threeA('', '', '');
    }).not.toThrow(ValidationError);
  });

  it('returns the same value of its original return value', async () => {
    expect.assertions(3);

    const [r1, r2, r3] = await Promise.all<string>([
      random(200),
      random(300),
      random(400)
    ]);

    const test: Test1 = new Test1();

    expect(test.oneA(r1)).toBe(r1);
    expect(test.twoA(r1, r2)).toBe(r2);
    expect(test.threeA(r1, r2, r3)).toBe(r3);
  });

  it('will throw ValueError when each first decorated arg is set to throw ValueError', () => {
    expect.assertions(3);

    const test: Test2 = new Test2();

    expect(() => {
      test.oneA('');
    }).toThrow(ValidationError);
    expect(() => {
      test.twoA('', '');
    }).toThrow(ValidationError);
    expect(() => {
      test.threeA('', '', '');
    }).toThrow(ValidationError);
  });

  it('will throw ValueError when each last decorated arg is set to throw ValueError', () => {
    expect.assertions(3);

    const test: Test3 = new Test3();

    expect(() => {
      test.oneA('');
    }).toThrow(ValidationError);
    expect(() => {
      test.twoA('', '');
    }).toThrow(ValidationError);
    expect(() => {
      test.threeA('', '', '');
    }).toThrow(ValidationError);
  });

  it('will throw ValueError when all decorated args are set to throw ValueError', () => {
    expect.assertions(3);

    const test: Test4 = new Test4();

    expect(() => {
      test.oneA('');
    }).toThrow(ValidationError);
    expect(() => {
      test.twoA('', '');
    }).toThrow(ValidationError);
    expect(() => {
      test.threeA('', '', '');
    }).toThrow(ValidationError);
  });
});
