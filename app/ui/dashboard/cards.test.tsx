import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import CardWrapper from './cards';
import * as fetchFunctions from '@/app/lib/data';

describe('CardWrapper', () => {
  beforeEach(() => {
    vi.mock('@/app/lib/data', async (importOriginal) => {
      const actual = await importOriginal() as typeof fetchFunctions;
      return {
        ...actual,
        fetchCardData: async () => ({
          totalPaidInvoices: 10,
          totalPendingInvoices: 5,
          numberOfInvoices: 15,
          numberOfCustomers: 5,
        }),
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('カードが表示されること', async () => {
    const { debug } = render(await CardWrapper());
    // console.log(debug());
    expect(screen.getByText('Collected')).toBeDefined();
    expect(screen.getByText('Pending')).toBeDefined();
    expect(screen.getByText('Total Invoices')).toBeDefined();
    expect(screen.getByText('Total Customers')).toBeDefined();
    // データが表示されること
    expect(screen.getByTestId('card-collected')).toHaveTextContent('10');
    expect(screen.getByTestId('card-pending')).toHaveTextContent('5');
    expect(screen.getByTestId('card-invoices')).toHaveTextContent('15');
    expect(screen.getByTestId('card-customers')).toHaveTextContent('5');
  });
});