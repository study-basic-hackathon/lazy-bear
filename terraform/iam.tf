# サービスアカウントとIAM関連の定義

# Cloud Runサービスが使用するサービスアカウント
resource "google_service_account" "lazy_bear_sa" {
  account_id   = "lazy-bear-cloud-run-sa"
  display_name = "Service Account for Lazy Bear Cloud Run"
  project      = var.project_id
}

# サービスアカウントにVertex AI Userのロールを付与
resource "google_project_iam_member" "vertex_ai_user_binding" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.lazy_bear_sa.email}"
}

# サービスアカウントにCloud SQL Clientのロールを付与
resource "google_project_iam_member" "cloud_sql_client_binding" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.lazy_bear_sa.email}"
}

# サービスアカウントにArtifact Registry Readerのロールを付与
resource "google_project_iam_member" "artifact_registry_reader_binding" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.lazy_bear_sa.email}"
}

# サービスアカウントにSecret Manager Secret Accessorのロールを付与
resource "google_project_iam_member" "secret_manager_accessor_binding" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.lazy_bear_sa.email}"
}