import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import Form from './create-form';
import { State } from '@/app/lib/actions';

const mockCustomerFields = [
  { id: '1', name: 'foo' },
  { id: '2', name: 'bar' },
];

// 後続のフォームバリデーションエラーチェックのため customerId を選択状態にする
const availableCustomer = () => {
  const customerSelect = screen.getByRole('combobox', { name: 'Choose customer' });
  fireEvent.change(customerSelect, { target: { value: '1' } });
};

describe('Form', () => {
  beforeEach(() => {
    vi.mock('@/app/lib/actions', () => {
      return {
        createInvoice: async (state: State, formData: FormData) => {
          if (formData.get('customerId') === '') {
            return {
              errors: { customerId: ['お客様を選択してください。'] },
              message: 'フィールドがありません。請求書の作成に失敗しました',
            };
          }
          if (formData.get('amount') === '0') {
            return {
              errors: { amount: ['$0より大きい金額を入力してください。'] },
              message: 'フィールドがありません。請求書の作成に失敗しました',
            };
          }
          if (formData.get('status') === null) {
            return {
              errors: { status: ["Invalid enum value. Expected 'pending' | 'paid', received ''"] },
              message: 'フィールドがありません。請求書の作成に失敗しました',
            };
          }
          return { message: 'データベースエラーです：請求書の作成に失敗しました。' };
        },
      };
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should render form with customer options', async () => {
    render(<Form customers={mockCustomerFields} />);
    expect(screen.getByRole('option', { name: 'foo' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'bar' })).toBeDefined();
  });

  test('Choose customer ドロップダウンリストが未選択のときのエラーを確認する', async () => {
    render(<Form customers={mockCustomerFields} />);
    const submitButton = screen.getByRole('button', { name: 'Create Invoice' });
    submitButton.click();
    expect(await screen.findByText('お客様を選択してください。')).toBeDefined();
  });

  test('Choose an amount 入力欄に 0 を入力したときのエラーを確認する', async () => {
    render(<Form customers={mockCustomerFields} />);
    availableCustomer();

    const amountInput: HTMLElement & { value: string } = screen.getByRole('spinbutton', { name: 'Choose an amount' });
    const submitButton = screen.getByRole('button', { name: 'Create Invoice' });

    amountInput.value = '0';
    submitButton.click();

    expect(await screen.findByText('$0より大きい金額を入力してください。')).toBeDefined();
  });

  test('should show error when status is empty', async () => {
    render(<Form customers={mockCustomerFields} />);
    availableCustomer();

    const statusPending = screen.getByRole('radio', { name: 'Pending' });
    const statusPaid = screen.getByRole('radio', { name: 'Paid' });
    expect(statusPending).not.toBeChecked();
    expect(statusPaid).not.toBeChecked();

    const submitButton = screen.getByRole('button', { name: 'Create Invoice' });
    submitButton.click();

    expect(await screen.findByText("Invalid enum value. Expected 'pending' | 'paid', received ''")).toBeDefined();
  });
});
