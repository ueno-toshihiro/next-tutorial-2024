import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react'
import Page from './page';

// testing-library は server component をサポートしていないため小孫にも server component がある場合機能しない
// そのため、小孫 component のテストは個別に行う必要がある
describe('Page', () => {
  test('should render dashboard page', async () => {
    // server component は非同期でレンダリングされるため、非同期でテストを実行する必要があります
    render(await Page());
    expect(
      screen.getByRole("heading", { level: 1, name: 'Dashboard' }),
    ).toBeDefined();
  });
});