import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
// NOTE: NextAuth.jsをauthConfigオブジェクトで初期化し、authプロパティをエクスポートしています。また、Middleware のmatcherオプションを使って、特定のパスで実行するように指定しています
// このタスクにミドルウェアを採用する利点は、ミドルウェアが認証を検証するまで保護されたルートはレンダリングを開始しないため、アプリケーションのセキュリティとパフォーマンスの両方が向上することです
