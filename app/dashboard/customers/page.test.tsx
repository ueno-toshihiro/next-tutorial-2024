import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import Page from './page';

describe('Page', () => {
  test('should render customers page', async () => {
    render(<Page />);
    expect(
      screen.getByText('Empty Page'),
    ).toBeDefined();
  });
});