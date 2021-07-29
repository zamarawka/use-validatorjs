import { renderHook, act } from '@testing-library/react-hooks';

import useValidator from '../src';

function t(key: string, params: { [key: string]: any }) {
  return key;
}

describe('useValidator hook testing', () => {
  it('Should correct render', () => {
    renderHook(() => useValidator(t, { some: '' }, { some: [] }));
  });
});
