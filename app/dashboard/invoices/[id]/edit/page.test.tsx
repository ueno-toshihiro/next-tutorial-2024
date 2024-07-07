import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import Page from './page';
import * as fetchFunctions from '@/app/lib/data';
import type {
  InvoiceForm,
  CustomerField,
} from '@/app/lib/definitions.ts';
import { notFound } from 'next/navigation';

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

const notFoundMock = vi.hoisted(() => vi.fn());

describe('Page', async () => {
  vi.mock('next/navigation', () => ({
    notFound: notFoundMock,
  })) 

  beforeEach(() => {
    vi.spyOn(fetchFunctions, 'fetchInvoiceById').mockResolvedValue(mockInvoice);
    vi.spyOn(fetchFunctions, 'fetchCustomers').mockResolvedValue(mockCustomerFields);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should return notFound when invoice is not found', async () => {
    // notFound は fetchInvoiceById が falsy を返したとき表示されるため、mockResolvedValue に null を渡す
    // @ts-ignore
    vi.spyOn(fetchFunctions, 'fetchInvoiceById').mockResolvedValue(null);
    const  params = { params: { id: '1' }};
    const result = await Page(params);
    expect(result).toEqual(notFound());
  });

  test('should render invoices page breadcrumbs', async () => {
    const  params = { params: { id: '1' }};
    render(await Page(params));
    expect(screen.getByRole('link', { name: 'Invoices'})).toBeDefined();
    expect(screen.getByRole('link', { name: 'Edit Invoice'})).toBeDefined();
  });
  test('should render invoices page form', async () => {
    const  params = { params: { id: '1' }};
    render(await Page(params));
    expect(screen.getByText('bar')).toBeDefined();
    expect(screen.getByText('foo')).toBeDefined();
  });
});
