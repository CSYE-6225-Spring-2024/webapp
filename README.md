## Web-App

### Build & Deploy Instructions

#### On Local

1. `npm install`
2. `node server.js` (startup file)
3. `brew services start postgresql`
4. `brew services stop postgresql`

#### CentOS 8

1. `ssh root@104.248.122.189`
2. `sudo dnf module enable postgresql:16`
3. `sudo dnf install postgresql-server`
4. `sudo systemctl start postgresql`
5. `sudo systemctl enable postgresql`
6. `sudo dnf module install nodejs:18/common`
7. `scp -r /Users/anirbandutta/Desktop/src/webapp-1.zip root@104.248.122.189:/root/src`
8. `curl -v -XPOST "http://localhost:8080/healthz"`

#### Packer Machine Images

1. `packer init file-name`
2. `packer fmt file-name`
3. `packer validate file-name`
4. `packer build file-name`

The machine image gets stored in Google cloud under project_name -> images

### Github Workflow

1. build.yaml : installs all the dependencies of node
2. tests.yml : runs tests to create user, get details, and update them. Runs on PR raised and PR merged
3. packer-build.yml: builds machine image and stores in google cloud after PR is merged
4. packer-validate.yml: runs packer fmt and packer validate on PR raised

### Reference Links

1. https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
2. https://gist.github.com/Chaser324/ce0505fbed06b947d962
3. https://www.npmjs.com/package/bcrypt
4. https://registry.terraform.io/providers/hashicorp/google/latest/docs
