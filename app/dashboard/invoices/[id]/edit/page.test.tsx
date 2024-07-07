import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import Page from './page';
import * as fetchFunctions from '@/app/lib/data';
import type {
  InvoiceForm,
  CustomerField,
} from '@/app/lib/definitions.ts';

const mockInvoice: InvoiceForm = {
  amount: 123,
  id: '1',
  customer_id: '1',
  status: 'pending',
};

const mockCustomerFields: CustomerField[] = [
  { id: '1', name: 'foo' },
  { id: '2', name: 'bar' },
];

describe('Page', async () => {
  beforeEach(() => {
    vi.spyOn(fetchFunctions, 'fetchInvoiceById').mockResolvedValue(mockInvoice);
    vi.spyOn(fetchFunctions, 'fetchCustomers').mockResolvedValue(mockCustomerFields);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should render invoices page', async () => {
    const  params = { params: { id: '1' }};
    render(await Page(params));
    expect(screen.getByText('bar')).toBeDefined();
    expect(screen.getByText('foo')).toBeDefined();
  });
});
