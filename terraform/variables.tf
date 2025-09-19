variable "project_id" {
  description = "The GCP project ID."
  type        = string
  default     = "lazy-bear-471016"
}

variable "region" {
  description = "The GCP region to deploy resources in."
  type        = string
  default     = "asia-northeast1"
}

variable "authorized_ip_address" {
  description = "The IP address authorized to connect to the Cloud SQL instance."
  type        = string
}