import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react'
import Layout from './layout';

describe('Layout', () => {
  test('should render children', () => {
    const children = 'Hello, World!';
    render(<Layout>{children}</Layout>);
    expect(screen.getByText(children)).toBeInTheDocument()
  });
});