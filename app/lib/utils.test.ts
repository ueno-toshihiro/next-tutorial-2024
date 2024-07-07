import { expect, test, describe } from 'vitest'
import { 
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination
} from './utils';

describe('formatCurrency', () => {
  test('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$10.00')
    expect(formatCurrency(100000)).toBe('$1,000.00')
    expect(formatCurrency(1000000)).toBe('$10,000.00')
  })
})
describe('formatDateToLocal', () => {
  test('should format date correctly', () => {
    expect(formatDateToLocal('2021-12-31')).toBe('Dec 31, 2021')
    expect(formatDateToLocal('2021-01-01')).toBe('Jan 1, 2021')
  })
})
describe('generateYAxis', () => {
  test('should generate y-axis labels correctly', () => {
    const revenue = [
      { month: 'Jan', revenue: 1000 },
      { month: 'Feb', revenue: 2000 },
      { month: 'Mar', revenue: 3000 },
      { month: 'Apr', revenue: 4000 },
      { month: 'May', revenue: 5000 },
    ]
    expect(generateYAxis(revenue)).toEqual({
      yAxisLabels: ['$5K', '$4K', '$3K', '$2K', '$1K', '$0K'],
      topLabel: 5000,
    })
  })
})
describe('generatePagination', () => {
  test('should generate pagination correctly', () => {
    expect(generatePagination(1, 7)).toEqual([1, 2, 3, 4, 5, 6 ,7])
    expect(generatePagination(1, 10)).toEqual([1, 2, 3, '...', 9, 10])
    expect(generatePagination(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10])
    expect(generatePagination(10, 10)).toEqual([1, 2, '...', 8, 9, 10])
  })
})

