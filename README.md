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

Check that the local Kubernetes setup is configured for the EKS cluster, optionall switch to the EKS cluster via `use-context`:

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

Optionally view the resource consumption via Docker statistics:

| Implementation                                 | Command                      |
|------------------------------------------------|------------------------------|
| Go                                             | `docker stats go-app-1`      |
| Nest                                           | `docker stats nest-app-1`    |
| Quarkus (either in JVM mode or in native mode) | `docker stats quarkus-app-1` |
| Rust                                           | `docker stats rust-app-1`    |

Run the load test via k6:

| Implementation                                 | Command                        |
|------------------------------------------------|--------------------------------|
| Go                                             | `k6 run test/k6/script.js`     |
| Nest                                           | `k6 run test/k6/script.js`     |
| Quarkus (either in JVM mode or in native mode) | `k6 run src/test/k6/script.js` |
| Rust                                           | `k6 run test/k6/script.js`     |

Run the measurement via [LiMo](../tools/limo/README.md) at the same time as the load tests:

| Implementation                                 | Command                                   |
|------------------------------------------------|-------------------------------------------|
| Go                                             | `../tools/limo/limo go-app-1 10s 15`      |
| Nest                                           | `../tools/limo/limo nest-app-1 10s 15`    |
| Quarkus (either in JVM mode or in native mode) | `../tools/limo/limo quarkus-app-1 10s 15` |
| Rust                                           | `../tools/limo/limo rust-app-1 10s 15`    |

Stop the application:

```shell
CTRL^C

docker-compose rm
```

### Measuring with the Green Metrics Tool

`/etc/hosts`

```
127.0.0.1       localhost api.green-coding.internal metrics.green-coding.internal
```

The Green Metrics Tool is executed in GitHub. We use a patched version of the green metrics tool,
see https://github.com/andreaswe/green-metrics-tool/tree/codespaces.

### Initialize the Codespace

Go to https://github.com/andreaswe/green-metrics-tool/tree/codespaces and click on 'Code' --> '
Codespaces' --> '...' --> 'New with options ...':

![GitHub codespaces setup](green-metrics-tool-codespaces-setup.png)

Select the following options when creating the codespace:

* Branch: codespaces
* Dev container configuration: Workshop
* Region: Europe West
* Machine type: 4-core

Once the codespace was created, run the following command in the terminal:

```shell
source .devcontainer/workshop/codespace-setup.sh
```

The PORTS tab should now contain mappings for the ports 9142, 9143, and 9573. Make the port 9142 publicly visible by
right-clicking on the mapping.

![GitHub codespaces ports](green-metrics-tool-codespaces-ports.png)

Open the mapping for port 9143 in the browser by right-clicking on the mapping and selecting
the first entry in context menu.

![GitHub codespaces open page](green-metrics-tool-codespaces-open.png)

Create an SSH key in the codespaces terminal and register it with Gitlab:

```shell
# generate SSH key
ssh-keygen -t ed25519 -C "your.name@qaware.de"
# show generated public key
cat /home/codespace/.ssh/id_ed25519.pub
# Go to https://gitlab.com/-/profile/keys and add the public SSH key to Gitlab
```

Clone this repository into the codespace of the Green Metrics Tool:

```shell
git clone git@gitlab.com:qaware/internal/gilden/gse-gilde/t-stack-comparison.git
```

### Run green metrics tool

Activate venv. Necessary, whenever the codespace was shutdown in between.

```shell
source venv/bin/activate
```

#### Quarkus JVM

```shell
python3 runner.py --name 'quarkus_jvm' --uri /workspaces/green-metrics-tool/t-stack-comparison/quarkus/ --allow-unsafe
```

#### Quarkus Native
For **java/quarkus native** edit the [quarkus/usage_scenario.yml](quarkus/usage_scenario.yml) and
replace `dockerfile: Dockerfile.jvm` with `dockerfile: Dockerfile.native`. Afterwards run:

```shell
python3 runner.py --name 'quarkus_native' --uri /workspaces/green-metrics-tool/t-stack-comparison/quarkus/ --allow-unsafe
```

#### Rust

```shell
python3 runner.py --name 'go' --uri /workspaces/green-metrics-tool/t-stack-comparison/go/ --allow-unsafe
```

#### Go

```shell
python3 runner.py --name 'rust' --uri /workspaces/green-metrics-tool/t-stack-comparison/rust/ --allow-unsafe
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
