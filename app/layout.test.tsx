import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react'
import RootLayout from './layout';

describe('RootLayout', () => {
  test('should render children', () => {
    const children = 'Hello, World!';
    const { debug } = render(<RootLayout>{children}</RootLayout>);
    // console.log(debug());
    expect(screen.getByText(children)).toBeInTheDocument()
  });
});