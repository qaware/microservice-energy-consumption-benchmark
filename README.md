# Comparing the Energy Consumption of Technology Stacks

Microservices are written in different languages and frameworks. Each language and framework has its advantages and
disadvantages. This comparison attempts to compare several popular languages and
frameworks with respect to energy consumption. A sample microservice serves as benchmark. Currently,
the following languages and frameworks are compared:

* Go with [Gin](https://gin-gonic.com/), see [Go microservice](services/go-gin/README.md),
* Java with [Quarkus](https://quarkus.io/) in JVM mode and in native mode,
  see [Quarkus microservice](services/java-quarkus/README.md),
* Java with [Spring](https://spring.io/) (on JVM), see [Spring microservice](services/java-spring/README.md),
* Rust with [Actix Web](https://actix.rs/), see [Rust microservice](services/rust-actix/README.md),
* Javascript/TypeScript with [Node.js](https://nodejs.org/) and [nest](https://nestjs.com/),
  see [Nest microservice](services/js-nest/README.md).

The following languages and frameworks are currently under development:

* Java with [Spring](https://spring.io/) in native mode.

The sample microservice is implemented in all languages and frameworks in a functionally equivalent way,
as much as possible. A [K6](https://k6.io/) load test simulates typical load on this benchmark. While
running the load test, energy consumption is measured via the following tools:

* [LiMo](tools/limo/README.md) for measuring CPU and memory usage with a simple linear model,
  see [Measuring with LiMo](#measuring-with-limo),
* [Green Metrics Tool](https://www.green-coding.io/de/projects/green-metrics-tool/) for measuring with several different
  sensors,
  see [Measuring with the Green Metrics Tool](#measuring-with-the-green-metrics-tool),
* [Kepler](https://sustainable-computing.io/) for measuring in a Kubernetes setup,
  see [Measuring with Kepler](#measuring-with-kepler).

## Setup

### Local setup

Make sure to have the following tools locally installed:

* Docker
* JDK (Java 21)
* Go
* Rust
* Node.js

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
| Spring                 | `MODE=jvm docker-compose up --build`    |

Optionally view the resource consumption via Docker statistics:

| Implementation                                 | Command                           |
|------------------------------------------------|-----------------------------------|
| Go                                             | `docker stats go-gin-app-1`       |
| Nest                                           | `docker stats js-nest-app-1`      |
| Quarkus (either in JVM mode or in native mode) | `docker stats java-quarkus-app-1` |
| Rust                                           | `docker stats rust-actix-app-1`   |
| Spring                                         | `docker stats java-spring-app-1`  |

Run the load test via k6 (you have to run them one by one!):

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

#### Setting up the Green Metrics Tool on an AWS EC2

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
git clone https://github.com/qaware/microservice-energy-consumption-benchmark.git
```

#### Running the Green Metrics Tool

Run the Green Metrics Tool:

| Implementation                                 | Command                                                                                   |
|------------------------------------------------|-------------------------------------------------------------------------------------------|
| Go                                             | `python3 runner.py --name go --uri ./services/go-gin --allow-unsafe --docker-prune`       |
| Nest                                           | `python3 runner.py --name go --uri ./services/js-nest --allow-unsafe --docker-prune`      |
| Quarkus (either in JVM mode or in native mode) | `python3 runner.py --name go --uri ./services/java-quarkus --allow-unsafe --docker-prune` |
| Rust                                           | `python3 runner.py --name go --uri ./services/rust-actix --allow-unsafe --docker-prune`   |
| Spring                                         | `python3 runner.py --name go --uri ./services/java-spring --allow-unsafe --docker-prune`  |

You can then [run the load test](#running-the-loadtest) and view the results in the GMT dashboard.

### Measuring with Kepler

#### Setting up Kepler

Please follow the instructions
from [Deploy using Helm Chart](https://sustainable-computing.io/installation/kepler-helm/) to deploy Kepler in a
Kubernetes cluster of your choice. Make sure you also setup Prometheus and Grafana, if you haven't already, and import
the [Kepler dashboard](https://github.com/sustainable-computing-io/kepler/blob/main/grafana-dashboards/Kepler-Exporter.json)
into Grafana.

When you're done, you can set up one of the services using [Tilt](https://tilt.dev/) by running `tilt up` in the root
directory of the service you want to measure. This will build the Docker image and deploy it to your Kubernetes cluster.
It will also establish a port-forward to the service, so you can directly run your k6 tests against it.

You can the [run the load test](#running-the-loadtest) and view the results in the Grafana dashboard.

### Running the loadtest

Run the load tests by executing

```shell
k6 run test/k6/script.js
```

Or run the five load tests all at once (including warmup) using:

```shell
cd test/k6
./k6_tests_with_increasing_rate.sh
```
