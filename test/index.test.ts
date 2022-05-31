import { renderHook, act } from '@testing-library/react-hooks';

import useValidator, { notIn } from '../src';

function t(key: string, params: { [key: string]: any }) {
  return key;
}

describe('useValidator hook testing', () => {
  it('Should correct render', () => {
    renderHook(() => useValidator(t, { some: '' }, { some: [] }));
  });
});

test('test rule notIn', () => {
  const { result } = renderHook(() => useValidator(t, {a: 'abc'}, {a: notIn(['abc'])}));
  expect(result.current.isErrors).toBeTruthy();
  expect(result.current.validation.a[0]).toBe('alreadyExists');
});
