packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1.0.0"
    }
  }
}

variable "image_description" {
  type        = string
  description = "providing image description"
  default     = "test"
}

variable "project_id" {
  type        = string
  description = "Project ID of GCP"
  default     = "test"
}

variable "source_image_family" {
  type        = string
  description = "Name of source image family"
  default     = "test"
}

variable "zone" {
  type        = string
  description = "Zone info to provide GCP"
  default     = "test"
}

variable "disk_size" {
  type        = number
  description = "Disk size of image provisioned"
  default     = 20
}

variable "disk_type" {
  type        = string
  description = "Disk type of image provisioned"
  default     = "test"
}

variable "image_name" {
  type        = string
  description = "Image name"
  default     = "test"
}

variable "image_family" {
  type        = string
  description = "Image family name"
  default     = "test"
}

variable "image_storage_locations" {
  type        = list(string)
  description = "Image geographic locations"
  default     = ["test"]
}

variable "ssh_username" {
  type        = string
  description = "ssh_username"
  default     = "test"
}

source "googlecompute" "webapp-vm-image" {
  image_description       = var.image_description
  project_id              = var.project_id
  source_image_family     = var.source_image_family
  zone                    = var.zone
  disk_size               = var.disk_size
  disk_type               = var.disk_type
  image_name              = var.image_name
  image_family            = var.image_family
  image_storage_locations = var.image_storage_locations
  ssh_username            = var.ssh_username
}

build {
  sources = ["sources.googlecompute.webapp-vm-image"]

  provisioner "shell" {
    scripts = [
      "../scripts/upgrades.sh",
      "../scripts/user.sh",
      "../scripts/dependency.sh",
      "../scripts/database.sh",
    ]
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }

  provisioner "shell" {
    scripts = [
      "../scripts/application.sh"
    ]
  }

  provisioner "file" {
    source      = "../systemd/csye6225.service"
    destination = "/tmp/"
  }

  provisioner "shell" {
    scripts = [
      "../scripts/systemd.sh"
    ]
  }
}