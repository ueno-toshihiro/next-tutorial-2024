import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react'
import Loading from './loading';

describe('Loading', () => {
  test('should render loading skeleton', () => {
    render(<Loading />);
    const skeletons = screen.getAllByTestId('cardSkeleton');
    const revenueChartSkeleton = screen.getAllByTestId('revenueChartSkeleton');
    const latestInvoicesSkeleton = screen.getAllByTestId('invoiceSkeleton');
    expect(skeletons).toHaveLength(4);
    expect(revenueChartSkeleton).toHaveLength(1);
    expect(latestInvoicesSkeleton).toHaveLength(5);
  });
});