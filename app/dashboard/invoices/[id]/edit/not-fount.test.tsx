import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  test('should render 404 Not Found', () => {
    render(<NotFound />);
    expect(screen.getByText('404 Not Found')).toBeDefined();
  });
  test('should render the go back button', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: 'Go Back' })).toBeDefined();
  });
});
