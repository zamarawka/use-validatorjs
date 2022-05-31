import { t } from './fixtures';
import {
  required,
  requiredIf,
  requiredUnless,
  requiredWith,
  requiredWithAll,
  requiredWithout,
  requiredWithoutAll,
  same,
  different,
  min,
  max,
  email,
  accepted,
} from '../src';

describe('Rule: required', () => {
  it('Error case', () => {
    expect(required(t, false)).toBeDefined();
    expect(required(t, NaN)).toBeDefined();
    expect(required(t, '')).toBeDefined();
    expect(required(t, '    ')).toBeDefined();
    expect(required(t, null)).toBeDefined();
    expect(required(t, undefined)).toBeDefined();
  });

  it('Valid case', () => {
    expect(required(t, true)).toBeUndefined();
    expect(required(t, 1)).toBeUndefined();
    expect(required(t, 10)).toBeUndefined();
    expect(required(t, 'some text')).toBeUndefined();
    expect(required(t, '0')).toBeUndefined();
  });
});

describe('Rule: requiredIf', () => {
  it('Error case', () => {
    expect(requiredIf(true, true)(t, false)).toBeDefined();
    expect(requiredIf(1, 1)(t, false)).toBeDefined();
    expect(requiredIf('1', '1')(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(requiredIf(true, false)(t, false)).toBeUndefined();
    expect(requiredIf(true, true)(t, true)).toBeUndefined();
    expect(requiredIf(1, 4)(t, false)).toBeUndefined();
    expect(requiredIf(1, 4)(t, false)).toBeUndefined();
    expect(requiredIf(1, 1)(t, true)).toBeUndefined();
  });
});

describe('Rule: requiredUnless', () => {
  it('Error case', () => {
    expect(requiredUnless(true, false)(t, false)).toBeDefined();
    expect(requiredUnless(1, 2)(t, false)).toBeDefined();
    expect(requiredUnless('1', '2')(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(requiredUnless(true, false)(t, true)).toBeUndefined();
    expect(requiredUnless(true, true)(t, false)).toBeUndefined();
    expect(requiredUnless(1, 4)(t, true)).toBeUndefined();
    expect(requiredUnless(1, 1)(t, false)).toBeUndefined();
    expect(requiredUnless(1, 1)(t, true)).toBeUndefined();
  });
});

describe('Rule: requiredWith', () => {
  it('Error case', () => {
    expect(requiredWith(true)(t, false)).toBeDefined();
    expect(requiredWith(1)(t, false)).toBeDefined();
    expect(requiredWith('some')(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(requiredWith(false)(t, false)).toBeUndefined();
    expect(requiredWith(true)(t, true)).toBeUndefined();
    expect(requiredWith(0)(t, false)).toBeUndefined();
    expect(requiredWith('')(t, false)).toBeUndefined();
    expect(requiredWith(null)(t, false)).toBeUndefined();
  });
});

describe('Rule: requiredWithAll', () => {
  it('Error case', () => {
    expect(requiredWithAll([true, 1, 'some'])(t, false)).toBeDefined();
    expect(requiredWithAll([1])(t, false)).toBeDefined();
    expect(requiredWithAll(['some'])(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(requiredWithAll([false, 0, '', null])(t, false)).toBeUndefined();
    expect(requiredWithAll([true])(t, true)).toBeUndefined();
  });
});

describe('Rule: requiredWithout', () => {
  it('Error case', () => {
    expect(requiredWithout(false)(t, false)).toBeDefined();
    expect(requiredWithout(0)(t, false)).toBeDefined();
    expect(requiredWithout('')(t, false)).toBeDefined();
    expect(requiredWithout(null)(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(requiredWithout(true)(t, false)).toBeUndefined();
    expect(requiredWithout(true)(t, true)).toBeUndefined();
    expect(requiredWithout(1)(t, false)).toBeUndefined();
    expect(requiredWithout('some')(t, false)).toBeUndefined();
  });
});

describe('Rule: requiredWithoutAll', () => {
  it('Error case', () => {
    expect(requiredWithoutAll([false, 0, ''])(t, false)).toBeDefined();
    expect(requiredWithoutAll([0])(t, false)).toBeDefined();
    expect(requiredWithoutAll([null])(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(requiredWithoutAll([true, 1, 'some'])(t, false)).toBeUndefined();
    expect(requiredWithoutAll([true])(t, true)).toBeUndefined();
  });
});

describe('Rule: same', () => {
  it('Error case', () => {
    expect(same('str')(t, 'val')).toBeDefined();
    expect(same(1)(t, 2)).toBeDefined();
    expect(same(true)(t, false)).toBeDefined();
  });

  it('Valid case', () => {
    expect(same('str')(t, 'str')).toBeUndefined();
    expect(same(1)(t, 1)).toBeUndefined();
    expect(same(true)(t, true)).toBeUndefined();
  });
});

describe('Rule: different', () => {
  it('Error case', () => {
    expect(different('str')(t, 'str')).toBeDefined();
    expect(different(1)(t, 1)).toBeDefined();
    expect(different(true)(t, true)).toBeDefined();
  });

  it('Valid case', () => {
    expect(different('str')(t, 'val')).toBeUndefined();
    expect(different(1)(t, 2)).toBeUndefined();
    expect(different(true)(t, false)).toBeUndefined();
  });
});

describe('Rule: min', () => {
  it('Error case', () => {
    expect(min(6)(t, 4)).toBeDefined();
  });

  it('Valid case', () => {
    expect(min(3)(t, 4)).toBeUndefined();
    expect(min(4)(t, 4)).toBeUndefined();
  });
});

describe('Rule: max', () => {
  it('Error case', () => {
    expect(max(3)(t, 4)).toBeDefined();
  });

  it('Valid case', () => {
    expect(max(6)(t, 4)).toBeUndefined();
    expect(max(4)(t, 4)).toBeUndefined();
  });
});

describe('Rule: email', () => {
  it('Error case', () => {
    expect(email(t, 'not email value')).toBeDefined();
    expect(email(t, '1')).toBeDefined();
    expect(email(t, '@example.com')).toBeDefined();
    expect(email(t, 'http://example.com')).toBeDefined();
    expect(email(t, 'example@com')).toBeDefined();
  });

  it('Valid case', () => {
    expect(email(t, 'some@exmaple.com')).toBeUndefined();
    expect(email(t, 'other-email123@example-url.com')).toBeUndefined();
    expect(email(t, '')).toBeUndefined();
  });
});

describe('Rule: accepted', () => {
  it('Error case', () => {
    expect(accepted(t, false)).toBeDefined();
    expect(accepted(t, 0)).toBeDefined();
  });

  it('Valid case', () => {
    expect(accepted(t, true)).toBeUndefined();
    expect(accepted(t, 1)).toBeUndefined();
  });
});
