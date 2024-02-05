# Comparison of Technology Stacks

## AWS

### Setup

Install and configure required tools:

* AWS CLI: see https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
  and https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
* eksctl: see https://eksctl.io/installation
* Helm: see https://helm.sh/docs/intro/install

Start the cluster with all required tools:

```shell
sh infrastructure/start-cluster.sh
sh infrastructure/setup-cluster.sh
```

The setup-script will establish port-forwarding for Grafana on port 3000 and should open localhost:3000 in a browser.
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

Greenframe (https://greenframe.io/) can compute the CO2 footprint of a service based on Docker
statistics (https://github.com/marmelab/greenframe-cli/blob/main/src/model/README.md).
The microservices and their dependencies are executed via `docker-compose`. See the relevant documentation for each of
the microservices.

## Green Metrics Tool

We use a patched version of the green metrics tool:
https://github.com/andreaswe/green-metrics-tool/tree/codespaces

### Setup Green Metrics Tool via Codespaces

#### Create Codespace

Go to https://github.com/andreaswe/green-metrics-tool/tree/codespaces, click on 'Code' > 'Codespaces' > '...' > 'New
with options ...' > Machine type '4-core' > Create codespace.

Once the codespace is setup you can reuse it. No need to recreate it every time.

#### Initialize Codespace

Only required for when the codespace was newly created

```shell
source .devcontainer/workshop/codespace-setup.sh
```

The ports tab should now mappings for the ports: 9142, 9143, 9573.
Make the port visibility for port 9142 public, if it is not public already (use right click on the mapping).
Open the mapping for the metrics page (port 9143) in the browser (right click on the mapping, first entry in context
menu).

#### Clone this repo into codespace

Only required for when the codespace was newly created

Before cloning the repo ensure allow access to gitlab by creating a ssh key and adding it to gitlab

```shell
# generate ssh key - replace mail by your address
ssh-keygen -t ed25519 -C "andreas.weber@qaware.de"
# show generated public key
cat /home/codespace/.ssh/id_ed25519.pub
# Go to https://gitlab.com/-/profile/keys and add the ssh key to gitlab
```

Clone this repo

```shell
git clone git@gitlab.com:qaware/internal/gilden/gse-gilde/t-stack-comparison.git
```

#### Run green metrics tool

Activate venv. Necessary, whenever the codespace was shutdown in between.

```shell
source venv/bin/activate
```

For **java/quarkus on JVM** run

```shell
python3 runner.py --name 'quarkus_jvm' --uri /workspaces/green-metrics-tool/t-stack-comparison/quarkus/ --allow-unsafe
```

For **java/quarkus native** edit the [quarkus/usage_scenario.yml](quarkus/usage_scenario.yml) and
replace `dockerfile: Dockerfile.jvm` with `dockerfile: Dockerfile.native`. Afterwards run:

```shell
python3 runner.py --name 'quarkus_native' --uri /workspaces/green-metrics-tool/t-stack-comparison/quarkus/ --allow-unsafe
```

For **go** run

```shell
python3 runner.py --name 'go' --uri /workspaces/green-metrics-tool/t-stack-comparison/go/ --allow-unsafe
```

For **rust** run

```shell
python3 runner.py --name 'rust' --uri /workspaces/green-metrics-tool/t-stack-comparison/rust/ --allow-unsafe
```
