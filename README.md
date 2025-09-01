# Lazy Bear

Next.js + PostgreSQL を使った Web アプリケーション

---

### 技術スタック

- **Frontend/Backend**: Next.js 15 (App Router)
- **Database**: PostgreSQL 17
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Container**: Docker & Docker Compose
- **Language**: TypeScript

---

### セットアップ方法

### 前提条件

- **Docker Desktop** がインストールされていること

### 1\. リポジトリをクローン

```bash
git clone <repository-url>
cd lazy-bear
```

### 2\. 環境変数ファイルの作成

`.env.example`をコピーして`.env`ファイルを作成し、`your_password_here`を任意のパスワードに置き換えてください。

```bash
cp .env.example .env
```

### 3\. Docker 環境の起動

Docker コンテナをビルドして起動します。初回実行時には、必要な Docker イメージがダウンロードされ、npm パッケージがインストールされます。

```bash
# フォアグラウンドで起動（ログを確認しながら作業する場合）
docker compose up --build

# バックグラウンドで起動（ターミナルを専有しない場合）
docker compose up -d --build
```

### 4\. アクセス確認

- **Next.js アプリ**: http://localhost:3000
- **PostgreSQL**: localhost:5432

---

### 開発コマンド

```bash
# コンテナ起動
docker compose up

# コンテナ停止
docker compose down

# ログ確認
docker compose logs app
docker compose logs database

# データベースに直接接続
docker exec -it lazy_bear_database psql -U postgres -d lazy_bear_dev
```

## データベース マイグレーション

### マイグレーションファイル生成

```bash
cd app
npm install
npm run db:generate
npm run db:migrate
```

---

### データベース GUI 接続

Postico2 や pgAdmin4 などの GUI ツールでデータベースに接続する際のパラメータです。

| パラメータ   | 設定値                             |
| :----------- | :--------------------------------- |
| **Host**     | `localhost`                        |
| **Port**     | `5432`                             |
| **User**     | `postgres`                         |
| **Password** | `.env`ファイルで設定したパスワード |
| **Database** | `lazy_bear_dev`                    |

---

### 注意事項

- **`.env`** ファイルは Git で管理されません。
- 初回起動時は Docker イメージのダウンロードに時間がかかります。
- データベースのデータは `postgres_data` ボリュームに永続化されます。
