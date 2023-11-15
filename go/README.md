# quarkus

## Building

Build and run the application:

```shell
docker-compose up --build
```

Run the load test via k6:

```shell
k6 run test/k6/script.js
```

Run the measurement via Greenframe:

```shell
greenframe analyze
```

View the resource consumption via Docker statistics:

```shell
docker stats go-go-1
```
