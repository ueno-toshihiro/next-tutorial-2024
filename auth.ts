import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    // NOTE: authorize関数は Server Actions と同様に zodを使用してメールとパスワードを検証してから、そのユーザがデータベースに存在するかどうかをチェックします
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);
      
      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;
      }

      return null;
    },
  })],
});
// NOTE: NextAuth.jsのprovidersオプションを追加します。providersは、GoogleやGitHubなどのさまざまなログインオプションを列挙する配列です
// ここでは next-auth の credentials プロバイダーを追加しています。これにより、ユーザー名とパスワードを使用してログインできるようになります
