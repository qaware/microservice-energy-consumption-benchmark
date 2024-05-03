# Comparing the Energy Consumption of Technology Stacks

Microservices are written in different languages and frameworks. Each language and framework has its advantages and
disadvantages. This comparison attempts to compare several popular languages and
frameworks with respect to energy consumption. A sample microservice serves as benchmark. Currently,
the following languages and frameworks are compared:

* Go with [Gin](https://gin-gonic.com/), see [Go microservice](go/README.md)
* Java with [Quarkus](https://quarkus.io/) in JVM mode and in native mode, see [Quarkus microservice](quarkus/README.md)
* Rust with [Actix Web](https://actix.rs/), see [Rust microservice](rust/README.md)
* Javascript/TypeScript with [Node.js](https://nodejs.org/) and [nest](https://nestjs.com/),
  see [Nest microservice](nest/README.md)

The following languages and frameworks are currently under development:

* Java with [Spring](https://spring.io/) in JVM mode and in native mode, see [Spring microservice](spring/README.md)

The sample microservice is implemented in all languages and frameworks in a functionally equivalent way,
as much as possible. A [K6](https://k6.io/) load test simulates typical load on this benchmark. While
running the load test, energy consumption is measured via the following tools:

* [LiMo](tools/limo/README.md) for measuring CPU and memory usage with a simple linear model,
  see [Measuring with LiMo](#measuring-with-limo)
* [Green Metrics Tool](https://www.green-coding.io/de/projects/green-metrics-tool/) for measuring with several different
  sensors,
  see [Measuring with the Green Metrics Tool](#measuring-with-the-green-metrics-tool)
* [Kepler](https://sustainable-computing.io/) for measuring in a Kubernetes setup,
  see [Measuring with Kepler](#measuring-with-kepler)

## Setup

### Local setup

Make sure to have the following tools locally installed:

* Docker
* JDK
* Go
* Rust
* Node.js

### AWS

#### Infrastructure

Install and configure required tools:

* AWS CLI: see https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
  and https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
* eksctl: see https://eksctl.io/installation
* Helm: see https://helm.sh/docs/intro/install

You can adapt the cluster configuration in [`infrastructure/green-eks-k8s.yaml`](./infrastructure/green-eks-k8s.yaml).

Log in to the ECR to push container images:

```shell
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 204306537988.dkr.ecr.eu-north-1.amazonaws.com
```

Start the cluster with all required tools:

```shell
sh infrastructure/start-cluster.sh
```

#### Check the infrastructure

Check that the cluster is up and running:

```shell
aws eks list-clusters
```

Make the cluster accessible locally:

```shell
aws eks update-kubeconfig --name green-eks-k8s
```

Check that the local Kubernetes setup is configured for the EKS cluster, optionally switch to the EKS cluster
via `use-context`:

```shell
kubectl config get-contexts
```

Check that three nodes are available:

```shell
kubectl get nodes
```

#### Allow access for other users

By default, only the user that created the cluster has access to the cluster. To allow other users to access the
cluster, you need to create an IAM identity mapping for the user.

Get the ARN of the user you own user, that you want to add:

```shell
aws sts get-caller-identity
```

Create an IAM identity mapping for the user

```shell
eksctl create iamidentitymapping \
--cluster green-eks-k8s \
--region eu-north-1 \
--arn arn:aws:iam::204306537988:user/FWE \
--group system:masters \
--no-duplicate-arns \
--username florian
```

#### Green Metrics Tool

Set up three EC2 instances with Ubuntu 22.04:

* backend: accessible via SSH and port 8500
* GMT: accessible via SSH and ports 9142 and 8080
* k6: accessible via SSH

Set up the backend EC2:

```shell
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl build-essential gcc make
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
ssh-keygen -t ed25519 -C "GMT-backend-on-AWS"
cat /home/ubuntu/.ssh/id_ed25519.pub
# Go to https://gitlab.com/-/profile/keys and add the ssh key to gitlab
git clone git@gitlab.com:qaware/internal/gilden/gse-gilde/t-stack-comparison.git
cd t-stack-comparison/tools/backend
cargo build --release
./target/release/backend
```

Set up the GMT EC2:

```shell
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git make gcc python3 python3-pip python3-venv
git clone https://github.com/green-coding-berlin/green-metrics-tool ~/green-metrics-tool
sudo apt install ca-certificates curl gnupg lsb-release -y
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt remove docker docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
sudo usermod -aG docker ubuntu
# log out and log in again
cd ~/green-metrics-tool
./install_linux.sh
# TODO: python3 -m pip install -r metric_providers/psu/energy/ac/xgboost/machine/model/requirements.txt
source venv/bin/activate
cd docker
docker compose up -d
cd
ssh-keygen -t ed25519 -C "GMT-setup-on-AWS"
cat /home/ubuntu/.ssh/id_ed25519.pub
# Go to https://gitlab.com/-/profile/keys and add the ssh key to gitlab
git clone git@gitlab.com:qaware/internal/gilden/gse-gilde/t-stack-comparison.git
```

The GMT dashboard is available at http://metrics.green-coding.internal:9142/. Possible set up SSH port forwarding:

```shell
ssh -i <KEY-PEM> -N -L 9142:localhost:9142 ubuntu@<EC2-HOSTNAME>
```

Edit the local `/etc/hosts`:

```text
127.0.0.1       localhost api.green-coding.internal metrics.green-coding.internal
```

Set up the k6 EC2:

```shell
sudo apt update && sudo apt upgrade -y
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
ssh-keygen -t ed25519 -C "GMT-k6-on-AWS"
cat /home/ubuntu/.ssh/id_ed25519.pub
# Go to https://gitlab.com/-/profile/keys and add the ssh key to gitlab
git clone git@gitlab.com:qaware/internal/gilden/gse-gilde/t-stack-comparison.git
```

## Measurements

### Measuring with LiMo

LiMo requires the microservice to be executed via `docker-compose`.The following commands must be executed in the root
directory of the microservice.

Build and run the application:

| Implementation         | Command                                 |
|------------------------|-----------------------------------------|
| Go                     | `docker-compose up --build`             |
| Nest                   | `docker-compose up --build`             |
| Quarkus in JVM mode    | `MODE=jvm docker-compose up --build`    |
| Quarkus in native mode | `MODE=native docker-compose up --build` |
| Rust                   | `docker-compose up --build`             |
| Spring                 | `docker-compose up --build`             |

Optionally view the resource consumption via Docker statistics:

| Implementation                                 | Command                           |
|------------------------------------------------|-----------------------------------|
| Go                                             | `docker stats go-gin-app-1`       |
| Nest                                           | `docker stats js-nest-app-1`      |
| Quarkus (either in JVM mode or in native mode) | `docker stats java-quarkus-app-1` |
| Rust                                           | `docker stats rust-actix-app-1`   |
| Spring                                         | `docker stats java-spring-app-1`  |

Run the load test via k6:

```shell
k6 run test/k6/script.js
```

Run the measurement via [LiMo](../tools/limo/README.md) at the same time as the load tests:

| Implementation                                 | Command                                       |
|------------------------------------------------|-----------------------------------------------|
| Go                                             | `./tools/limo/limo go-gin-app-1 10s 15`       |
| Nest                                           | `./tools/limo/limo js-nest-app-1 10s 15`      |
| Quarkus (either in JVM mode or in native mode) | `./tools/limo/limo java-quarkus-app-1 10s 15` |
| Rust                                           | `./tools/limo/limo rust-app-1 10s 15`         |
| Spring                                         | `./tools/limo/limo java-spring-app-1 10s 15`  |

Stop the application:

```shell
CTRL^C

docker-compose rm
```

### Measuring with the Green Metrics Tool

Run the Green Metrics Tool:

| Implementation                                 | Command                                                                                                      |
|------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Go                                             | `python3 runner.py --name go --uri ~/t-stack-comparison/services/go-gin --allow-unsafe --docker-prune`       |
| Nest                                           | `python3 runner.py --name go --uri ~/t-stack-comparison/services/js-nest --allow-unsafe --docker-prune`      |
| Quarkus (either in JVM mode or in native mode) | `python3 runner.py --name go --uri ~/t-stack-comparison/services/java-quarkus --allow-unsafe --docker-prune` |
| Rust                                           | `python3 runner.py --name go --uri ~/t-stack-comparison/services/rust-actix --allow-unsafe --docker-prune`   |
| Spring                                         | `python3 runner.py --name go --uri ~/t-stack-comparison/services/java-spring --allow-unsafe --docker-prune`  |

Run the load tests:

```shell
k6 run test/k6/script.js
```

### Measuring with Kepler

#### Setting up Kepler

Run the setup script:

```shell
sh infrastructure/setup-cluster-for-kepler.sh
```

The script will establish port-forwarding for Grafana on port 3000 and should open localhost:3000 in a browser.
Use the following credentials to log in:

* username: admin
* password: prom-operator

Go to http://localhost:3000/dashboard/import to import the [Kepler dashboard](infrastructure/Kepler-Exporter.json).

#### Running the load tests

#### Go

```
cd go
tilt up
k6 run test/k6/script.js
```

#### Nest

```
cd nest
tilt up
k6 run test/k6/script.js
```

#### Quarkus

```
cd quarkus
tilt up
k6 run src/test/k6/script.js
```

#### Rust

```
cd rust
tilt up
k6 run test/k6/script.js
```

### Clean-up

Stop the cluster:

```shell
sh infrastructure/stop-cluster.sh
```
