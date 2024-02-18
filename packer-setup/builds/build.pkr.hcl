packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1.0.0"
    }
  }
}

source "googlecompute" "webapp-vm-image" {
  image_description       = "Image for Cloud-6225-A04"
  project_id              = "csye6225-anirban-002979520" //change to DEV later
  source_image_family     = "centos-stream-8"
  zone                    = "us-east1-b"
  disk_size               = 20
  disk_type               = "pd-standard"
  image_name              = "webapp-vm-image-{{timestamp}}"
  image_family            = "csye6225"
  image_storage_locations = ["us"]
  ssh_username            = "packer"
  tags                    = ["webapp-centos-8"]
}

build {
  sources = ["sources.googlecompute.webapp-vm-image"]

  provisioner "shell" {
    scripts = [
      # "../scripts/upgrades.sh",
      "../scripts/user.sh",
      "../scripts/dependency.sh",
      "../scripts/database.sh",
    ]
  }

  provisioner "file" {
    source = "webapp.zip"
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