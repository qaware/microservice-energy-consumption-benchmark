# LiMo - A Linear Model to Compute Power Usage in Docker Containers

Docker statistics give insights into the usage of CPU, memory and network. Based on these numbers, the power usage
of a container is computed as follows:

* `cpuWh` = `pue` * `cpuFactor` * `cpuUsageInNs` / `expiredTimeInNs`
* `memoryWh` = `pue` * `memoryFactor` * `averageMemoryUsageInGb`
* `networkWh` = `networkFactor` * (`receivedGbs` + `sentGbs`)
* `totalWh` = `cpuWh` + `memoryWh` + `networkWh`

The following constants are assumed in this model:

| field                             | value  | unit  |
|-----------------------------------|--------|-------|
| `pue` (power usage effectiveness) | 1.4    |       |
| `cpuFactor`                       | 45     | W     |
| `memoryFactor`                    | 10/128 | Wh/GB |
| `networkFactor`                   | 11     | Wh/GB |

This model is based on the [Greenframe model](https://github.com/marmelab/greenframe-cli/blob/main/src/model/README.md).

## Building the application

```shell
go build .
```

## Running the application

Compute the energy consumption of a container:

```shell
./limo <container-id> <runtime> <iterations>
```

Measurement is repeatedly performed for the given runtime, given as duration such as `30s`. After each iteration,
the measured values are printed. The average values of all iterations are printed in the end.
