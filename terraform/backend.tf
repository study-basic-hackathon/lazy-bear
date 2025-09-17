terraform {
  backend "gcs" {
    bucket = "lazy-bear-471016-tfstate"
    prefix = "terraform/state"
  }
}
