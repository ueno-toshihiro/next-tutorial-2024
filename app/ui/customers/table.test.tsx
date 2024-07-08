import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import CustomersTable from './table';
import * as navigation from 'next/navigation';


// 子孫コンポーネントの next/navigation の関数がエラーを起こすため、mock する
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal() as typeof navigation;
  return {
    ...actual,
    useRouter: () => ({
      replace: vi.fn(),
    }),
    useSearchParams: () => {
      return {
        get: () => '1',
      };
    },
  }
});

const customersTable = [
  {
    id: '1',
    name: 'John Doe',
    email: 'foo@bar.com',
    image_url: 'https://example.com/image.jpg',
    total_invoices: 10,
    total_pending: '5',
    total_paid: '5',
  },
];

describe('Table', () => {
  test('テーブルが表示されること', async () => {
    render(await CustomersTable({ customers: customersTable}));
    expect(screen.getByRole('table')).toBeDefined();
    expect(screen.findAllByText('John Doe')).toBeDefined();
    expect(screen.findAllByText('foo@bar.com'));
  });

  test('検索フォームが表示されること', async () => {
    render(await CustomersTable({ customers: customersTable}));
    expect(screen.getByPlaceholderText('Search customers...')).toBeDefined();
  });
});