resource "google_compute_network" "vpc" {
  name                    = "lazy-bear-vpc"
  auto_create_subnetworks = false
  project                 = var.project_id
}

resource "google_compute_subnetwork" "subnet" {
  name                     = "lazy-bear-subnet"
  ip_cidr_range            = "10.0.0.0/28"
  region                   = "asia-northeast1"
  network                  = google_compute_network.vpc.id
  private_ip_google_access = true
  project                  = var.project_id
}

resource "google_vpc_access_connector" "connector" {
  name          = "lazy-bear-connector"
  region        = "asia-northeast1"
  subnet {
    name = google_compute_subnetwork.subnet.name
  }
  machine_type = "e2-micro"
  min_instances = 2
  max_instances = 3
  depends_on = [
    google_project_service.apis
  ]
  project      = var.project_id
}

resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-address-for-gcp-services"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
  project       = var.project_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
  depends_on = [
    google_project_service.apis
  ]
}
