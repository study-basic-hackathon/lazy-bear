# Terraform & GCP デプロイ準備チェックリスト

このドキュメントは、Terraformを使用してGCP（Cloud Run, Cloud SQL）へ`lazy-bear`プロジェクトをデプロイするために必要な情報を整理するためのチェックリストです。

以下の項目を埋めてください。不明な点や、Terraform側で自動生成を希望する項目についてはその旨を記載してください。

**注意:** パスワードやAPIキーなどの機密情報は、直接このファイルに書き込まないでください。これらの管理方法については別途検討します（例: Google Secret Manager）。

---

## 1. GCP基本設定

- [ ] **GCPプロジェクトID:** `lazy-bear-471016`
- [ ] **リージョン:** `asia-northeast1`
- [ ] **Terraformバックエンド用GCSバケット名:** (Terraformの状態ファイルを保存するGCSバケット。存在しない場合は作成されます) `まだ用意してません`

---

## 2. Cloud SQL (PostgreSQL) 設定

- [x] **インスタンス名:**　`lazy-bear-db-instance`
- [x] **データベースのバージョン:** `POSTGRES_17`
- [x] **マシンタイプ（Tier）:** `db-g1-small`
- [x] **データベース名 (初期データベース):** `lazy_bear`
- [x] **データベースユーザー名:** `lazybear_user`
- [ ] **データベースユーザーのパスワード:** **(ここには書き込まないでください)**

---

## 3. Artifact Registry 設定

(Cloud Runで動かすDockerイメージを保存する場所です)

- [x] **リポジトリ名:** `lazy-bear-repo`

---

## 4. Cloud Run 設定

- [x] **サービス名:** `lazy-bear-app`
- [x] **CPU & メモリ:** `1`, `512Mi`
- [x] **最小/最大インスタンス数:** `0` / `3`
- [x] **環境変数:**
    - `DATABASE_URL`: (Cloud SQLへの接続情報。Terraformで自動生成します)
    - `GOOGLE_CLOUD_PROJECT=lazy-bear-471016`
    - `GOOGLE_CLOUD_LOCATION=us-central1`
    - `VERTEX_AI_MODEL_NAME=gemini-2.5-flash-lite`

---

## 5. ネットワーキング設定

- [x] **VPC名:** `lazy-bear-vpc`（新規）
- [x] **サブネット名:** `lazy-bear-subnet` (新規)
- [x] **VPCコネクタ名:** `lazy-bear-connector`

---
