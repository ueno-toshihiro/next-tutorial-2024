import { expect, test, describe } from 'vitest';
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '@/app/lib/actions';

describe('actions', () => {
  describe('createInvoice', () => {
    test('formData の amount が 0 のときエラーを返す', async () => {
      // FormData オブジェクトをモック
      const formData = new FormData();
      formData.append('customerId', '1');
      formData.append('amount', '0');
      formData.append('status', 'pending');

      const result = await createInvoice({ message: null, errors: {} }, formData);
      expect(result).toEqual({
        errors: { amount: ['$0より大きい金額を入力してください。'] },
        message: 'フィールドがありません。請求書の作成に失敗しました',
      });
    });

    test('formData の status が未入力のときエラーを返す', async () => {
      // FormData オブジェクトをモック
      const formData = new FormData();
      formData.append('customerId', '1');
      formData.append('amount', '123');
      formData.append('status', '');

      const result = await createInvoice({ message: null, errors: {} }, formData);
      expect(result).toEqual({
        errors: { status: ["Invalid enum value. Expected 'pending' | 'paid', received ''"] },
        message: 'フィールドがありません。請求書の作成に失敗しました',
      });
    });
    
    test('sql が実行されること（sql はテストできないため実行の失敗を確認する）', async () => {
      // FormData オブジェクトをモック
      const formData = new FormData();
      formData.append('customerId', '1');
      formData.append('amount', '123');
      formData.append('status', 'pending');

      const result = await createInvoice({ message: null, errors: {} }, formData);
      expect(result).toEqual({ message: 'データベースエラーです：請求書の作成に失敗しました。' });
    });
  });

  describe('updateInvoice', () => {
    test('formData の amount が 0 のときエラーを返す', async () => {
      // FormData オブジェクトをモック
      const formData = new FormData();
      formData.append('customerId', '1');
      formData.append('amount', '0');
      formData.append('status', 'pending');

      const result = await updateInvoice('1', { message: null, errors: {} }, formData);
      expect(result).toEqual({
        errors: { amount: ['$0より大きい金額を入力してください。'] },
        message: 'フィールドがありません。請求書の更新に失敗しました。',
      });
    });

    test('formData の status が未入力のときエラーを返す', async () => {
      // FormData オブジェクトをモック
      const formData = new FormData();
      formData.append('customerId', '1');
      formData.append('amount', '123');
      formData.append('status', '');

      const result = await updateInvoice('1', { message: null, errors: {} }, formData);
      expect(result).toEqual({
        errors: { status: ["Invalid enum value. Expected 'pending' | 'paid', received ''"] },
        message: 'フィールドがありません。請求書の更新に失敗しました。',
      });
    });
    
    test('sql が実行されること（sql はテストできないため実行の失敗を確認する）', async () => {
      // FormData オブジェクトをモック
      const formData = new FormData();
      formData.append('customerId', '1');
      formData.append('amount', '123');
      formData.append('status', 'pending');

      const result = await updateInvoice('1', { message: null, errors: {} }, formData);
      expect(result).toEqual({ message: 'データベースエラーです：請求書の更新に失敗しました。' });
    });
  });

  describe('deleteInvoice', () => {
    test('sql が実行されること（sql はテストできないため実行の失敗を確認する）', async () => {
      const result = await deleteInvoice('1');
      expect(result).toEqual({ message: 'Database Error: Failed to Delete Invoice.' });
    });
  });
});

