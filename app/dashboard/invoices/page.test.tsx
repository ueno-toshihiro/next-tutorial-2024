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
    vi.spyOn(fetchFunctions, 'fetchInvoicesPages').mockReturnValue(new Promise((resolve) => resolve(1)));
  });
  afterEach(() => {
    vi.restoreAllMocks()
  });

  test('should render invoices page', async () => {
    const {debug} = render(await Page(mockData));
    // console.log(debug());
    expect(
      screen.getByRole("heading", { level: 1, name: 'Invoices'}))
      .toBeDefined();
  });
});
