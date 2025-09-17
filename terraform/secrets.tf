resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "google_secret_manager_secret" "db_password_secret" {
  secret_id = "db_password"
  project   = var.project_id

  replication {
    auto {}
  }

  depends_on = [
    google_project_service.apis
  ]
}

resource "google_secret_manager_secret_version" "db_password_secret_version" {
  secret      = google_secret_manager_secret.db_password_secret.id
  secret_data = random_password.db_password.result
}
