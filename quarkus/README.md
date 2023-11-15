# quarkus

## Setup for docker-compose (Greenframe)

Build the application:

```shell
./gradlew assemble
```

Run the application:

```shell
docker-compose up
```

View the resource consumption via Docker statistics:

```shell
docker stats quarkus-quarkus-1
```

Run the load test via k6:

```shell
k6 run src/test/k6/script.js
```

Run the measurement via Greenframe:

```shell
greenframe analyze
```

## Setup for Tilt and Kubernetes

Build and run the application:

```shell
tilt up
```

Run the load test via k6:

```shell
k6 run src/test/k6/script.js
```

View the resource consumption via Kubernetes statistics:

```shell
./run-kubectl-top.sh
```
