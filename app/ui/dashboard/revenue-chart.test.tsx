import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import RevenueChart from './revenue-chart';
import * as fetchFunctions from '@/app/lib/data';
import { b } from 'vitest/dist/suite-IbNSsUWN.js';

const data = [
  {
    month: 'Jan',
    revenue: 100,
  },
  {
    month: 'Feb',
    revenue: 500,
  },
  {
    month: 'Mar',
    revenue: 1200,
  },
];

describe('RevenueChart', () => {
  beforeEach(() => {
    vi.mock('@/app/lib/data', async (importOriginal) => {
      const actual = await importOriginal() as typeof fetchFunctions;
      return {
        ...actual,
        fetchRevenue: async () => data,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('収益チャートが表示されること', async () => {
    const {debug} = render(await RevenueChart());
    console.log(debug());
    // 月メモリが表示されること
    expect(screen.getByText('Jan')).toBeDefined();
    expect(screen.getByText('Feb')).toBeDefined();
    expect(screen.getByText('Mar')).toBeDefined();
    // 金額メモリが表示されること
    expect(screen.getByText('$0K')).toBeDefined();
    expect(screen.getByText('$1K')).toBeDefined();
    expect(screen.getByText('$2K')).toBeDefined();
  });
});
