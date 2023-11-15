# quarkus

## Building

Build the application:

```shell
./gradlew assemble
```

Run the application:

```shell
docker-compose up
```

Run the load test via k6:

```shell
k6 run src/test/k6/script.js
```

Run the measurement via Greenframe:

```shell
greenframe analyze
```

View the resource consumption via Docker statistics:

```shell
docker stats quarkus-quarkus-1
```
