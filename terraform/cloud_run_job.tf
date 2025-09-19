
# データベースマイグレーションを実行するためのCloud Runジョブ
resource "google_cloud_run_v2_job" "migration_job" {
  name     = "lazy-bear-migration"
  location = "asia-northeast1"
  project  = var.project_id

  template {
    template {
      service_account = google_service_account.lazy_bear_sa.email

      vpc_access {
        connector = google_vpc_access_connector.connector.id
        egress    = "ALL_TRAFFIC"
      }

      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/lazy-bear-repo/lazy-bear-app:latest"

        # コンテナの起動コマンドをマイグレーションスクリプトに上書き
        command = ["npm", "run", "db:migrate"]

        env {
          name = "DATABASE_URL"
          value = "postgresql://${google_sql_user.user.name}:${random_password.db_password.result}@/${google_sql_database.database.name}?host=/cloudsql/${google_sql_database_instance.instance.connection_name}"
        }
      }
    }
  }

  depends_on = [
    google_sql_database.database,
    google_sql_user.user
  ]
}
