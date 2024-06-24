import { useMemo, useCallback, useState } from 'react';

export type TranslateFn = (key: string, params?: { [key: string]: any }) => string;
export type CheckerFn<T> = (t: TranslateFn, val: T) => void | string;
export type Rules<T> = { [K in keyof T]?: CheckerFn<T[K]> | CheckerFn<T[K]>[] };

export const customMessage =
  <T>(message: string, cb: CheckerFn<T>): CheckerFn<T> =>
  (_t, val) =>
    cb(() => message, val);

export default function useValidation<T>(t: TranslateFn, data: T, rules: Rules<T>) {
  const [isShowErrors, setShowErrors] = useState(false);

  const showErrors = useCallback((val = true) => {
    setShowErrors(val);
  }, []);

  const validation = useMemo(() => {
    const err: { [K in keyof T]?: string[] } = {};

    for (const key in rules) {
      const rulesByKey = Array.isArray(rules[key]) ? rules[key] : [rules[key]];

      for (const rule of rulesByKey as CheckerFn<T[typeof key]>[]) {
        const valid = rule(t, data[key]);

        if (valid) {
          if (err[key]) {
            err[key].push(valid);
          } else {
            err[key] = [valid];
          }
        }
      }
    }

    return err;
  }, [data, t, rules]);

  const isErrors = useMemo(() => Object.keys(validation).length > 0, [validation]);

  const errors: { [K in keyof T]?: string[] } = useMemo(
    () => (isShowErrors ? validation : {}),
    [isShowErrors, validation],
  );

  return { isErrors, isShowErrors, errors, showErrors, validation };
}

type RequiredValue = string | number | boolean;

export const required: CheckerFn<RequiredValue> = (t, val) => {
  if (val === null || val === undefined) {
    return t('required');
  }

  switch (typeof val) {
    case 'string':
      return val.trim() === '' ? t('required') : undefined;

    case 'number':
      return isNaN(val) ? t('required') : undefined;

    case 'boolean':
      return !val ? t('required') : undefined;
  }
};

export const requiredIf =
  <T>(dataVal: T, check: T): CheckerFn<RequiredValue> =>
  (t, val) => {
    if (dataVal === check) {
      return required(t, val);
    }
  };

export const requiredUnless =
  <T>(dataVal: T, check: T): CheckerFn<RequiredValue> =>
  (t, val) => {
    if (dataVal !== check) {
      return required(t, val);
    }
  };

export const requiredWith =
  <T>(dataVal: T): CheckerFn<RequiredValue> =>
  (t, val) => {
    if (dataVal) {
      return required(t, val);
    }
  };

export const requiredWithAll =
  (dataVal: any[]): CheckerFn<RequiredValue> =>
  (t, val) => {
    if (dataVal.every((val) => !!val)) {
      return required(t, val);
    }
  };

export const requiredWithout =
  <T>(dataVal: T): CheckerFn<RequiredValue> =>
  (t, val) => {
    if (!dataVal) {
      return required(t, val);
    }
  };

export const requiredWithoutAll =
  (dataVal: any[]): CheckerFn<RequiredValue> =>
  (t, val) => {
    if (dataVal.every((val) => !val)) {
      return required(t, val);
    }
  };

export const same =
  <T>(dataVal: T): CheckerFn<T> =>
  (t, val) => {
    if (dataVal !== val) {
      return t('same', { val, dataVal });
    }
  };

export const different =
  <T>(dataVal: T): CheckerFn<T> =>
  (t, val) => {
    if (dataVal === val) {
      return t('different', { val, dataVal });
    }
  };

export const min =
  (min: number): CheckerFn<number> =>
  (t, val) => {
    if (val < min) {
      return t('min', { min });
    }
  };

export const max =
  (max: number): CheckerFn<number> =>
  (t, val) => {
    if (val > max) {
      return t('max', { max });
    }
  };

export const minLength =
  (min: number): CheckerFn<string> =>
  (t, val) => {
    if (val.length < min) {
      return t('minLength', { min });
    }
  };

export const maxLength =
  (max: number): CheckerFn<string> =>
  (t, val) => {
    if (val.length > max) {
      return t('maxLength', { max });
    }
  };

export const email: CheckerFn<string> = (t, val) => {
  // eslint-disable-next-line max-len
  const emailRE =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (val !== '' && !emailRE.test(val)) {
    return t('email');
  }
};

export const accepted: CheckerFn<boolean | number> = (t, val) => {
  if (!val) {
    return t('accepted');
  }
};

export const notIn =
  <T>(dataVal: T[]): CheckerFn<T> =>
  (t, val) => {
    if (dataVal.includes(val)) {
      return t('alreadyExists');
    }
  };
