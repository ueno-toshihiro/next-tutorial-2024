import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import Page from './page';
import * as fetchFunctions from '@/app/lib/data';

const mockInvoice = {
  amount: 123,
  id: '1',
  customer_id: '1',
  status: 'pending',
};

const mockCustomerFields = [
  { id: '1', name: 'foo' },
  { id: '2', name: 'bar' },
];

describe('Page', () => {
  beforeEach(() => {
    vi.spyOn(fetchFunctions, 'fetchCustomers').mockResolvedValue(mockCustomerFields);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should render create invoices page breadcrumbs', async () => {
    const {debug} = render(await Page());
    // console.log(debug());
    expect(screen.getByRole('link', { name: 'Invoices'})).toBeDefined();
    expect(screen.getByRole('link', { name: 'Create Invoice'})).toBeDefined();
  });
  test('should render create invoices page form', async () => {
    render(await Page());
    expect(screen.getByRole('option', { name: 'foo' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'bar' })).toBeDefined();
  });
});