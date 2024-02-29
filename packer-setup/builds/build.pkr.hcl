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
  default     = "Webapp image made by packer"
}

variable "project_id" {
  type        = string
  description = "Project ID of GCP"
  default     = env("PKR_PROJECT_ID")
}

variable "source_image_family" {
  type        = string
  description = "Name of source image family"
  default     = env("PKR_SOURCE_IMG_FAM")
}

variable "zone" {
  type        = string
  description = "Zone info to provide GCP"
  default     = env("PKR_ZONE")
}

variable "disk_size" {
  type        = number
  description = "Disk size of image provisioned"
  default     = env("PKR_DISK_SIZE")
}

variable "disk_type" {
  type        = string
  description = "Disk type of image provisioned"
  default     = env("PKR_DISK_TYPE")
}

variable "image_name" {
  type        = string
  description = "Image name"
  default     = "webapp-vm-image-{{timestamp}}"
}

variable "image_family" {
  type        = string
  description = "Image family name"
  default     = "csye6225"
}

variable "image_storage_locations" {
  type        = list(string)
  description = "Image geographic locations"
  default     = ["us"]
}

variable "ssh_username" {
  type        = string
  description = "ssh_username"
  default     = env("PKR_SSH_USERNAME")
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