# Terraform & GCP デプロイ準備チェックリスト

このドキュメントは、Terraformを使用してGCP（Cloud Run, Cloud SQL）へ`lazy-bear`プロジェクトをデプロイするために必要な情報を整理するためのチェックリストです。

以下の項目を埋めてください。不明な点や、Terraform側で自動生成を希望する項目についてはその旨を記載してください。

**注意:** パスワードやAPIキーなどの機密情報は、直接このファイルに書き込まないでください。これらの管理方法については別途検討します（例: Google Secret Manager）。

---

## 1. GCP基本設定

- [ ] **GCPプロジェクトID:** `your-gcp-project-id`
- [ ] **リージョン:** (例: `asia-northeast1`)
- [ ] **Terraformバックエンド用GCSバケット名:** (Terraformの状態ファイルを保存するGCSバケット。存在しない場合は作成されます) `your-terraform-state-bucket-name`

---

## 2. Cloud SQL (PostgreSQL) 設定

- [ ] **インスタンス名:** (例: `lazy-bear-db-instance`)
- [ ] **データベースのバージョン:** (例: `POSTGRES_15`)
- [ ] **マシンタイプ（Tier）:** (例: `db-g1-small`)
- [ ] **データベース名 (初期データベース):** (例: `lazybear_db`)
- [ ] **データベースユーザー名:** (例: `lazybear_user`)
- [ ] **データベースユーザーのパスワード:** **(ここには書き込まないでください)**

---

## 3. Artifact Registry 設定

(Cloud Runで動かすDockerイメージを保存する場所です)

- [ ] **リポジトリ名:** (例: `lazy-bear-repo`)

---

## 4. Cloud Run 設定

- [ ] **サービス名:** (例: `lazy-bear-app`)
- [ ] **CPU & メモリ:** (例: `1`, `512Mi`)
- [ ] **最小/最大インスタンス数:** (例: `0` / `3`)
- [ ] **環境変数:**
    - `DATABASE_URL`: (Cloud SQLへの接続情報。Terraformで自動生成します)
    - (その他、アプリケーションが必要とする環境変数があれば列挙してください)

---

## 5. ネットワーキング設定

- [ ] **VPC名:** (既存のVPCを利用しますか？ 新規作成しますか？ 例: `lazy-bear-vpc`)
- [ ] **サブネット名:** (例: `lazy-bear-subnet`)
- [ ] **VPCコネクタ名:** (Cloud RunがCloud SQLと通信するために必要です。例: `lazy-bear-connector`)

---
