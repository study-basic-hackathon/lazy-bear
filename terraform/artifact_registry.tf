resource "google_artifact_registry_repository" "repository" {
  location      = "asia-northeast1"
  repository_id = "lazy-bear-repo"
  description   = "Docker repository for lazy-bear application"
  format        = "DOCKER"
  project       = var.project_id

  depends_on = [
    google_project_service.apis
  ]
}
