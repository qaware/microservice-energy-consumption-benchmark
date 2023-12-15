# Comparison of Technology Stacks

## AWS

### Setup

Install and configure required tools:

* AWS CLI: see https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html and https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
* eksctl: see https://eksctl.io/installation
* Helm: see https://helm.sh/docs/intro/install

Start the cluster with all required tools:

```shell
sh infrastructure/start-cluster.sh
sh infrastructure/setup-cluster.sh
```

Establish port for Grafana via k9s, use port 3000. Grafana should then be available at localhost:3000.
Use the following credentials to log in:

* username: admin
* password: prom-operator

Go to http://localhost:3000/dashboard/import to import the [Kepler dashboard](infrastructure/Kepler-Exporter.json).

Log in to the ECR to push container images:

```shell
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 204306537988.dkr.ecr.eu-north-1.amazonaws.com
```

### Run the load tests

#### Go

```
cd go
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

## Greenframe

Greenframe (https://greenframe.io/) can compute the CO2 footprint of a service based on Docker statistics (https://github.com/marmelab/greenframe-cli/blob/main/src/model/README.md). 
The microservices and their dependencies are executed via `docker-compose`. See the relevant documentation for each of the microservices.
