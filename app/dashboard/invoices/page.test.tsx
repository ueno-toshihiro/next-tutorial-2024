import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import Page from './page';
import * as fetchFunctions from '@/app/lib/data';
import * as navigation from 'next/navigation';

const mockData = {
  searchParams: {
    query: 'query',
    page: '1',
  },
};

// 子孫コンポーネントの next/navigation の関数軍がエラーを起こすため、mock する
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal() as typeof navigation;
  return {
    ...actual,
    useRouter: () => ({
      replace: vi.fn(),
    }),
    usePathname() {
      return '/dashboard/invoices';
    },
    useSearchParams: () => {
      return {
        get: () => '1',
      };
    },
  }
});

describe('Page', () => {
  beforeEach(() => {
    vi.mock('@/app/lib/data', async (importOriginal) => {
      const actual = await importOriginal() as typeof fetchFunctions;
      return {
        ...actual,
        fetchInvoicesPages: async () => new Promise((resolve) => resolve(1)),
        fetchFilteredInvoices: async () => new Promise((resolve) => resolve([])),
      };
    });
  });
  afterEach(() => {
    vi.restoreAllMocks()
  });

  test('Page が表示されることを確認する', async () => {
    render(await Page(mockData));
    expect(
      screen.getByRole("heading", { level: 1, name: 'Invoices'}))
      .toBeDefined();
  });

  test('引数の searchParams が空オブジェクトのとき内部変数 query は "", currentPage は 1 となることを確認する', async () => {
    render(await Page({}));
    const query = '';
    const currentPage = 1;  
    expect(screen.getByTestId(`pageArgs-${query}-${currentPage}`)).toBeDefined();
  });

  test('引数の searchParams に値があるとき内部変数 query は "testFooBar", currentPage は 2 となることを確認する', async () => {
    const params = {
      searchParams: {
        query: 'testFooBar',
        page: '2',
      }
    };

    render(await Page(params));
    const query = params.searchParams.query;
    const currentPage = params.searchParams.page;  
    expect(screen.getByTestId(`pageArgs-${query}-${currentPage}`)).toBeDefined();
  });
});
