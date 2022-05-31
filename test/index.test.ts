import { renderHook, act } from '@testing-library/react-hooks';

import useValidator, { required, customMessage } from '../src';
import { t, customRule } from './fixtures';

describe('useValidator hook testing', () => {
  it('Should correct render', () => {
    renderHook(() => useValidator(t, { some: '' }, { some: [] }));
  });

  it('Should run validation process', () => {
    const {
      result: { current },
    } = renderHook(() =>
      useValidator(t, { some: '', other: 45 }, { some: [required, customRule], other: required }),
    );

    expect(current.isErrors).toBe(true);
    expect(current.validation).toHaveProperty('some');
    expect(current.validation).not.toHaveProperty('other');
    expect(current.validation.some).toContain('required');
    expect(current.validation.some).toContain('customRule');
  });

  it('Should show errors', async () => {
    const { result } = renderHook(() =>
      useValidator(t, { some: '', other: 45 }, { some: [required], other: required }),
    );

    expect(result.current.isErrors).toBe(true);
    expect(result.current.isShowErrors).toBe(false);
    expect(result.current.errors).toEqual({});

    act(() => {
      result.current.showErrors();
    });

    expect(result.current.isShowErrors).toBe(true);
    expect(result.current.errors).toHaveProperty('some');
    expect(result.current.errors).not.toHaveProperty('other');
    expect(result.current.errors.some).toContain('required');

    act(() => {
      result.current.showErrors(false);
    });

    expect(result.current.isShowErrors).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  it('Should customise error message', async () => {
    const {
      result: { current },
    } = renderHook(() =>
      useValidator(t, { some: '' }, { some: [customMessage('custom required message', required)] }),
    );

    expect(current.isErrors).toBe(true);
    expect(current.validation).toHaveProperty('some');
    expect(current.validation.some).toContain('custom required message');
    expect(current.validation.some).not.toContain('required');
  });
});
