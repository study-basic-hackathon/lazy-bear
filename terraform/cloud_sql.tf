resource "google_sql_database_instance" "instance" {
  name             = "lazy-bear-db-instance"
  database_version = "POSTGRES_17"
  region           = "asia-northeast1"
  project          = var.project_id

  settings {
    tier              = "db-g1-small"
    edition           = "ENTERPRISE"
    availability_type = "REGIONAL"
    disk_autoresize   = true
    disk_size         = 10

    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.vpc.id
      authorized_networks {
        value = "${var.authorized_ip_address}/32"
        name  = "local-ipv4"
      }
    }

    backup_configuration {
      enabled = true
    }
  }

  deletion_protection = false # Set to true in production

  depends_on = [
    google_service_networking_connection.private_vpc_connection
  ]
}

resource "google_sql_database" "database" {
  name     = "lazy_bear"
  instance = google_sql_database_instance.instance.name
  project  = var.project_id
}

resource "google_sql_user" "user" {
  name     = "lazybear_user"
  instance = google_sql_database_instance.instance.name
  password = random_password.db_password.result
  project  = var.project_id
}
