import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import LoginPage from './page';

describe('LoginPage', () => {
  test('ログインフォームが表示されること', () => {
    render(<LoginPage />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeDefined();
  });
});
