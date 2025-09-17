resource "google_cloud_run_v2_service" "service" {
  name     = "lazy-bear-app"
  location = "asia-northeast1"
  project  = var.project_id

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "ALL_TRAFFIC"
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/lazy-bear-repo/lazy-bear-app:latest" # Placeholder image

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "GOOGLE_CLOUD_LOCATION"
        value = "us-central1"
      }
      env {
        name  = "VERTEX_AI_MODEL_NAME"
        value = "gemini-1.5-flash-latest"
      }
      env {
        name = "DATABASE_URL"
        value = "postgresql://${google_sql_user.user.name}:${random_password.db_password.result}@/${google_sql_database.database.name}?host=/cloudsql/${google_sql_database_instance.instance.connection_name}"
      }
    }
  }

  depends_on = [
    google_project_service.apis,
    google_sql_user.user
  ]
}

resource "google_cloud_run_service_iam_member" "allow_unauthenticated" {
  location = google_cloud_run_v2_service.service.location
  project  = google_cloud_run_v2_service.service.project
  service  = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
