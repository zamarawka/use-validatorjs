import { CheckerFn } from '../src';

export const customRule: CheckerFn<any> = (t) => t('customRule');

export function t(key: string, params?: { [key: string]: any }) {
  return `${key}${
    params
      ? '?' +
        Object.entries(params)
          .map((en) => en.join('='))
          .join('&')
      : ''
  }`;
}
