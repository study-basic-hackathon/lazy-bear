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

### 3\. Google Cloud CLI の設定

コンテナ内のアプリケーションがVertex AIなどのGoogle Cloudサービスにアクセスするために、ローカル環境でGoogle Cloud CLIの認証設定を行う必要があります。`docker-compose.yml`の設定により、ローカルの認証情報がコンテナに共有されます。

1. **Google Cloud CLIをインストールします。**
   [公式ドキュメント](https://cloud.google.com/sdk/docs/install)を参考に、お使いのOSに合わせてインストールしてください。

2. **アプリケーションのデフォルト認証情報でログインします。**
   以下のコマンドを実行するとブラウザが開き、認証を求められます。
   ```bash
   gcloud auth application-default login
   ```

3. **プロジェクトを設定します。**
   `.env`ファイルに記載した`GOOGLE_CLOUD_PROJECT`と同じプロジェクトIDを設定してください。
   ```bash
   gcloud config set project <your-project-id>
   ```

### 4\. Docker 環境の起動

Docker コンテナをビルドして起動します。初回実行時には、必要な Docker イメージがダウンロードされ、npm パッケージがインストールされます。

```bash
# フォアグラウンドで起動（ログを確認しながら作業する場合）
docker compose up --build

# バックグラウンドで起動（ターミナルを専有しない場合）
docker compose up -d --build
```

### 5\. アクセス確認

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

データベースのテーブル構造（スキーマ）は、マイグレーションファイルを通して管理・共有されます。

### 最新のスキーマを取り込む場合 (変更担当者以外向け)

他の開発者が行ったスキーマ変更をローカルのデータベースに反映させるには、Gitで最新のソースコード（新しいマイグレーションファイルを含む）を取得した後、以下のコマンドを実行します。

```bash
docker compose exec app npm run db:migrate
```

**注意:** スキーマ定義を直接変更していない場合は、`db:generate`コマンドを実行しないでください。意図しないマイグレーションファイルが生成され、コンフリクトの原因となります。

### スキーマ定義を変更する場合 (担当者向け)

テーブルやカラムの追加・変更など、スキーマ定義 (`app/src/lib/db/schema/` 内のファイル) を変更した開発者は、以下の手順を実施する責任があります。

1.  **マイグレーションファイルを生成する**
    スキーマ定義の変更後、データベースへの変更内容を記述したSQLファイルを生成します。
    ```bash
    docker compose exec app npm run db:generate
    ```
    生成されたSQLファイル (`app/src/lib/db/migrations/*.sql`) は、必ずGitにコミットしてチームで共有してください。

2.  **マイグレーションを適用する**
    生成したSQLファイルを自身のローカルデータベースに適用し、動作確認を行います。
    ```bash
    docker compose exec app npm run db:migrate
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
