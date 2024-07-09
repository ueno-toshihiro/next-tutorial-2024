import { expect, test, describe, vi } from 'vitest';
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  authenticate,
} from '@/app/lib/actions';
import { AuthError } from 'next-auth';

// AuthError を継承したカスタムエラークラスで type プロパティを持たせて error.type をテストする
class CustomAuthError extends AuthError  {
  static type: string;

  constructor(message?: any) {
    super();
    this.type = message;
  }
}

// vi.mockが巻き上げされたことにより、後続の異常系 vi.mock が先行の異常系 vi.mock を上書きしてしまうので、vi.hoisted を利用して巻き上げを抑制する
const { signInError } = vi.hoisted(() => {
  return {
    signInError: vi.fn(),
  };
});
// モックの設定
vi.mock('@/auth', () => {
  return {
    signIn: signInError,
  };
});

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

  describe('authenticate', () => {
    test('error.type CredentialsSignin のとき戻り値が Invalid credentials. になることを確認する ', async () => {
      signInError.mockRejectedValue(new CustomAuthError('CredentialsSignin'));

      const result = await authenticate(undefined, new FormData());
      expect(result).toBe('Invalid credentials.');
    });

    test('error.type CredentialsSignin 以外のとき戻り値が something went wrong. になることを確認する', async () => {
      signInError.mockRejectedValue(new CustomAuthError('Foo'));

      const result = await authenticate(undefined, new FormData());
      expect(result).toBe('Something went wrong.');
    });

    test('error.type がないときは エラー内容をそのまま返すことを確認する', async () => {
      signInError.mockRejectedValue('huga');

      try {
        await authenticate(undefined, new FormData());
      } catch (error) {
        expect(error).toBe('huga');
      }
    });
  });
});
