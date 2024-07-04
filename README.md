## Next.js App Router Course - Starter

学習内容を記録するためのリポジトリです
1. フォントとヒーローイメージ追加
---
2. サイドバーとLink設定
  - dashboard のサイドバーと各ページの雛形
  - Link を a タグの代わりに使うことで、プリフェッチと部分レンダリングを可能にし、リンク押下時のブラウザ再レンダリングを防止し描画スピードに貢献している
  ---
3. Postgresデータベースの作成後 seed 削除
  - vercel サイトで Postgresデータベースの作成
  - .env に必要項目追加
  - pnpm run dev 実行後、ブラウザで localhost:3000/seed を表示すると app/seed が実行され postgres にデータを追加した
  ---
4. SQLでデータをfetchしてdashboardのUIに反映
  - サーバーサイドレンダリングではコンポーネントで直接SQLを書いてデータを取得後にHTMLとして完成したものがブラウザで表示される
  - データ操作もSQLにより行うことでクライアント側は何もしない（これを「サーバーコンポーネント」といって静的コンポーネントなのでデータが変わっても画面は変更されない）
  ---
5. dashboard に loading 追加
  - loading.tsx は 特別な Next.js ファイルで Suspense 上に構築されている Next.js コンポーネントにデータを fetch 完了するまで loading.tsx のコンポーネントが表示される仕組み
  https://nextjs.org/learn/dashboard-app/streaming#streaming-a-whole-page-with-loadingtsx
  ---
6. dashboard のローディングをスケルトンに変更
  - loading.tsx を関連するルート（ディレクトリ）に移動すると、その配下のコンポーネントだけ loading.tsx が表示されることで画面毎のローディングを指定できる

  - ルートグループを使用すると、URLパスの構造に影響を与えることなく、ファイルを論理的なグループにまとめることができます。括弧（）を使用して新しいフォルダを作成すると、その名前はURLパスに含まれません。つまり、/dashboard/(overview)/page.tsxは /dashboardになります。
  ここでは、loading.tsxがダッシュボードの概要ページにのみ適用されるように、ルートグループを使用しています。しかし、ルートグループを使用して、アプリケーションをセクションに分けたり(例えば、(マーケティング)ルートと(ショップ)ルート)、大規模なアプリケーションのためにチームごとに分けることもできます。
---
7. dashboard の個別データを Suspense でラップ
  - 個別でデータを fetch すると全てのデータが揃わなくても dashboard が表示できる
  また、データを fetch する個別のコンポーネントに Suspense と fallback を指定することでデータを読み込まれた順に表示されるので全体の描画は早くなる
---
8. パーシャルプリレンダリングの実装
  - Link で指定されたルートをプリレンダリングしたいときはこの設定をするだけで良い
  - https://nextjs.org/learn/dashboard-app/partial-prerendering
---
9. データ検索とクエリパラメータ設定
  - 検索入力欄に use-debounce ライブラリにより 300ms 間隔でデータを取得するように変更
  - 検索文字はSQLによりDBから都度データを取得する
  - 検索文字はクエリパラメータとしてURLでブラウザに保持しているため state を使わない

  - 備考
    - use client"- クライアント・コンポーネント指定で イベント・リスナーやフックを使うことができます
    - 検索入力欄の input に value を使わず defaultValue を使う理由
  検索用の input はステートを使用しないので defaultValue を使用することができる。これは、ネイティブ入力が独自の状態を管理することを意味します。※ステートの代わりに検索クエリをURLに保存しているので問題ありません
---
10. クエリパラメータを変更してデータ取得後にUIを変更するパターン
  - ページネーションの実装
  - React の state を使わずに ページング時にクエリパラメータを変更してデータを取得し、UIを書き換えている

  - 備考
    - クライアントの状態ではなく、URLの検索パラメータで検索とページネーションを処理している。
    - サーバー上のデータを取得しました。
    - useRouterルーターフックを使うことで、クライアント側でのトランジションがよりスムーズになります。

  - これらのパターンは、クライアントサイドのReactで作業するときに慣れ親しんだものとは異なるが、URL検索パラメータを使用し、この状態をサーバーに持ち上げる利点があるようだ
---
11. フォームによりサーバーのデータとUIを更新
  - 追加・削除・変更 を フォームアクションからSQLによるデータ変更後、UIを更新する
---
12. データ更新時のエラー処理画面追加
  - error を catch すると、Next.js は error.tsx コンポーネントを自動で表示する仕組みがある

  - NOTE
    - error.tsx ファイルは、ルートセグメントの UI 境界を定義するために使用できます。
  これは予期しないエラーのためのキャッチオールとして機能し、ユーザーにフォールバックUIを表示することができます。

  - Error コンポーネントは、error, reset を引数として持っており、Next.js が自動で処理する。
    - error は javascript のネイティブErrorオブジェクト
    - reset は 関数でルートセグメントの再レンダリングを実行する
---
13. Not Found ページ追加
  - Next.js で Not Found を表示するには
    - ルーティング（ディレクトリ配下）に not-found.tsx ファイルを作る　
    - next/navigation の notFound() 関数を起動

  - 備考
    - notFoundは error.tsxよりも優先されるので、より具体的なエラーに対処したい場合は、notFoundを使うことができる
---
14. form のバリデーション
  - edit-form.tsxコンポーネントにuseActionStateを追加
  - zod でフォームのバリデーションとエラー時のラベルを指定
  - create-form.tsx の aria ラベルについて(アクセシビリティを向上)
    - aria-describedby="customer-error"：これはselect要素とエラーメッセージコンテナとの関係を確立します。これは、id="customer-error"のコンテナがselect要素を記述していることを示します。スクリーン・リーダは、ユーザがエラーを通知するためにセレクト・ボックスと対話するときに、この説明を読みます。
    - id="customer-error"：このid属性は、セレクト入力のエラーメッセージを保持する HTML 要素を一意に識別します。これは、aria-describedbyが関係を確立するために必要です。
    - aria-live="polite"：div内のエラーが更新されたとき、スクリーン・リーダーはユーザーに丁寧に通知する必要があります。コンテンツが変更されたとき（たとえば、ユーザがエラーを修正したとき）、スクリーン・リーダーはこれらの変更をアナウンスしますが、ユーザの邪魔にならないように、ユーザがアイドルであるときに限ります。
---
15. ログイン・ログアウト（認証）追加
  - 参照
    - https://nextjs.org/learn/dashboard-app/adding-authentication
---
16. favicon と opengraph-image をヘッダーに追加
  - /app ルートに favicon, opengraph-image を移動
  - こうすると Next.jsは自動的にこれらのファイルを識別し、ファビコンとog画像として使用します
---
17. 共通メタデータ追加
---
18. 特定のページのメタデータを変更する
  - 個別ページのメタデータを変えたときは共通メタデータを上書きする
---


For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.
