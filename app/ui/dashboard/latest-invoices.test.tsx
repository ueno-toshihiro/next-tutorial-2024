import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import LatestInvoices from './latest-invoices';
import * as fetchFunctions from '@/app/lib/data';

const invoices = [
  {
    id: '1',
    amount: '100',
    name: 'John Doe',
    email: 'foo@bar.com',
    image_url: 'https://example.com/image.jpg',
  },
  {
    id: '2',
    amount: '200',
    name: 'Jane Doe',
    email: 'foo-bar@hoge.com',
    image_url: 'https://example.com/image.jpg',
  },
];

describe('LatestInvoices', () => {
  beforeEach(() => {
    vi.mock('@/app/lib/data', async (importOriginal) => {
      const actual = await importOriginal() as typeof fetchFunctions;
      return {
        ...actual,
        fetchLatestInvoices: async () => invoices,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('最新の請求書が表示されること', async () => {
    const {debug} = render(await LatestInvoices());
    console.log(debug());
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Jane Doe')).toBeDefined();
    expect(screen.getByText('foo@bar.com')).toBeDefined();
    expect(screen.getByText('foo-bar@hoge.com')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('200')).toBeDefined();
  });
});
