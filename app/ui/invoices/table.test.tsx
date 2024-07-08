import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import * as fetchFunctions from '@/app/lib/data';
import InvoicesTable from './table';
import { stat } from 'fs';
import { date } from 'zod';

const invoices = [
  {
    id: '1',
    customer_id: '1',
    name: 'John Doe',
    email: 'foo@bar.com',
    image_url: 'https://example.com/image.jpg',
    date: '2020-01-01',
    amount: '100',
    status: 'paid',
  },
  {
    id: '2',
    customer_id: '2',
    name: 'Jane Doe',
    email: 'foo-bar@hoge.com',
    image_url: 'https://example.com/image.jpg',
    date: '2021-02-03',
    amount: '200',
    status: 'pending',
  },
];

describe('InvoicesTable', () => {
  beforeEach(() => {
    vi.mock('@/app/lib/data', async (importOriginal) => {
      const actual = await importOriginal() as typeof fetchFunctions;
      return {
        ...actual,
        fetchFilteredInvoices: async () => invoices,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('最新の請求書が表示されること', async () => {
    const {debug} = render(await InvoicesTable({ query: '', currentPage: 1}));
    // console.log(debug());
    expect(screen.findByText('John Doe')).toBeDefined();
    expect(screen.findByText('foo@bar.com')).toBeDefined();
    expect(screen.findByText('Paid')).toBeDefined();
    expect(screen.findByText('$1.00')).toBeDefined();
    expect(screen.findByText('Jan 1, 2020')).toBeDefined();
    expect(screen.findByText('Jane Doe')).toBeDefined();
    expect(screen.findByText('foo-bar@hoge.com')).toBeDefined();
    expect(screen.findByText('$2.00')).toBeDefined();
    expect(screen.findByText('Feb 3, 2021')).toBeDefined();
  });
});
