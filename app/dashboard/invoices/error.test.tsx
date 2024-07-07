import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import Error from './error';

describe('Error', () => {
  test('should render error page', () => {
    const error = { message: 'Error Page', name: 'Error'};
    const reset = () => {};
    render(<Error error={error} reset={reset}/>);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Something went wrong!' }),
    ).toBeDefined();
  });
  test('should click reset button', () => {
    const error = { message: 'Error Page', name: 'Error'};
    const reset = vi.fn();
    render(<Error error={error} reset={reset}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalled();
  });
});
