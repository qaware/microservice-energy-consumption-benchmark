package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/docker/docker/client"
	"os"
	"strconv"
	"time"
)

type container struct {
	Read     time.Time          `json:"read"`
	Cpu      cpu                `json:"cpu_stats"`
	Memory   memory             `json:"memory_stats"`
	Networks map[string]network `json:"networks"`
}

type cpu struct {
	Usage      cpuUsage `json:"cpu_usage"`
	SystemTime uint64   `json:"system_cpu_usage"`
}

type cpuUsage struct {
	Total uint64 `json:"total_usage"`
}

type memory struct {
	Usage uint64 `json:"usage"`
}

type network struct {
	ReceivedBytes uint64 `json:"rx_bytes"`
	SentBytes     uint64 `json:"tx_bytes"`
}

const cpuPower = float64(45)                        // in W
const memoryPowerPerGb = float64(10) / float64(128) // in W per GB
const networkEnergyPerGb = float64(11)              // Wh per GB
const pue = float64(1.4)                            // power usage efficiency
const giga = float64(1_000_000_000)
const nanosecondsPerHour = 3600 * giga

var initialized bool
var startCpuUsageInNanos uint64
var startSystemTimeInNanos uint64
var weightedMemoryUsageInBytesForNanos float64
var startNetworkReceivedBytes map[string]uint64
var startNetworkSentBytes map[string]uint64

var lastCpuUsageInNanos uint64
var lastSystemTimeInNanos uint64
var lastMemoryUsageInBytes uint64
var lastNetworkNames []string
var lastNetworkReceivedBytes map[string]uint64
var lastNetworkSentBytes map[string]uint64

var cpuWhs []float64
var memoryWhs []float64
var networkWhs []float64
var coreWhs []float64
var totalWhs []float64

func initialize(cnt container) {
	initialized = true
	startCpuUsageInNanos = cnt.Cpu.Usage.Total
	startSystemTimeInNanos = cnt.Cpu.SystemTime
	weightedMemoryUsageInBytesForNanos = 0
	lastNetworkNames, startNetworkReceivedBytes, startNetworkSentBytes = getNetworkBytes(cnt.Networks)

	lastCpuUsageInNanos = startCpuUsageInNanos
	lastSystemTimeInNanos = startSystemTimeInNanos
	lastMemoryUsageInBytes = cnt.Memory.Usage
	lastNetworkReceivedBytes = startNetworkReceivedBytes
	lastNetworkSentBytes = startNetworkSentBytes
}

func step(cnt container) {
	currentSystemTime := cnt.Cpu.SystemTime

	// Memory usage might be fluctuating over the runtime of the measurement.
	// Instead of taking the average memory usage of the entire runtime, the average memory usage per timeframe,
	// where each timeframe might differ in length, is summed up. This approach smooths out fluctuations of
	// memory usage.
	averageMemoryUsageInLastTimeframeUsageInBytes := average(lastMemoryUsageInBytes, cnt.Memory.Usage)
	weightedMemoryUsageInLastTimeframe := averageMemoryUsageInLastTimeframeUsageInBytes * float64(currentSystemTime-lastSystemTimeInNanos)
	weightedMemoryUsageInBytesForNanos += weightedMemoryUsageInLastTimeframe

	lastCpuUsageInNanos = cnt.Cpu.Usage.Total
	lastSystemTimeInNanos = currentSystemTime
	lastMemoryUsageInBytes = cnt.Memory.Usage
	lastNetworkNames, lastNetworkReceivedBytes, lastNetworkSentBytes = getNetworkBytes(cnt.Networks)
}

func summary(iteration int) {
	cpuUsageInNanos := float64(lastCpuUsageInNanos - startCpuUsageInNanos)
	cpuWh := (pue * cpuPower * cpuUsageInNanos) / nanosecondsPerHour

	memoryWh := (pue * memoryPowerPerGb * (weightedMemoryUsageInBytesForNanos / giga)) / nanosecondsPerHour

	var networkTotalBytes uint64
	for _, name := range lastNetworkNames {
		networkTotalBytes += lastNetworkReceivedBytes[name] - startNetworkReceivedBytes[name]
		networkTotalBytes += lastNetworkSentBytes[name] - startNetworkSentBytes[name]
	}
	networkWh := networkEnergyPerGb * float64(networkTotalBytes) / giga

	coreWh := cpuWh + memoryWh
	totalWh := cpuWh + memoryWh + networkWh

	cpuWhs = append(cpuWhs, cpuWh)
	memoryWhs = append(memoryWhs, memoryWh)
	networkWhs = append(networkWhs, networkWh)
	coreWhs = append(coreWhs, coreWh)
	totalWhs = append(totalWhs, totalWh)
	initialized = false

	fmt.Printf("[Iteration %2d]   CPU %.3f Wh   MEMORY %.3f Wh   NETWORK %.3f Wh   CORE %.3f WH   TOTAL %.3f Wh   (cpu %f, mem %f, net %f)\n",
		iteration, cpuWh, memoryWh, networkWh, coreWh, totalWh,
		cpuUsageInNanos/nanosecondsPerHour,
		(weightedMemoryUsageInBytesForNanos/giga)/nanosecondsPerHour,
		float64(networkTotalBytes)/giga)
}

func totalSummary() {
	fmt.Printf("\n[Total]          CPU %.3f Wh   MEMORY %.3f Wh   NETWORK %.3f Wh   CORE %.3f WH   TOTAL %.3f Wh\n",
		averages(cpuWhs), averages(memoryWhs), averages(networkWhs), averages(coreWhs), averages(totalWhs))
}

func getNetworkBytes(networks map[string]network) (names []string, received map[string]uint64, sent map[string]uint64) {
	names = make([]string, 0, len(networks))
	received = make(map[string]uint64)
	sent = make(map[string]uint64)

	for name, network := range networks {
		names = append(names, name)
		received[name] = network.ReceivedBytes
		sent[name] = network.SentBytes
	}
	return names, received, sent
}

func average(number1 uint64, number2 uint64) float64 {
	return float64(number1+number2) / float64(2)
}

func averages(numbers []float64) float64 {
	var sum float64
	for _, v := range numbers {
		sum += v
	}
	return sum / float64(len(numbers))
}

func run(cli *client.Client, containerId string, runtime time.Duration) {
	ctx, cancel := context.WithTimeout(context.Background(), runtime)

	stats, err := cli.ContainerStats(ctx, containerId, true)
	if err != nil {
		fmt.Println(err)
		cancel()
		return
	}

	decoder := json.NewDecoder(stats.Body)

	for {
		select {
		case <-ctx.Done():
			err := stats.Body.Close()
			if err != nil {
				fmt.Println(err)
			}
			cancel()
			return
		default:
			var cnt container
			if err := decoder.Decode(&cnt); err != nil {
				cancel()
				return
			} else if !initialized {
				initialize(cnt)
			} else {
				step(cnt)
			}
		}
	}
}

func main() {
	if len(os.Args) < 3 {
		println("usage: limo <container-id> <runtime> <iterations>")
		return
	}

	containerId := os.Args[1]
	runtime, err := time.ParseDuration(os.Args[2])
	if err != nil {
		fmt.Println(err)
		return
	}
	iterations, err := strconv.Atoi(os.Args[3])
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("Measuring '%s' for %v with %d iterations ...\n\n", containerId, runtime, iterations)

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		fmt.Println(err)
		return
	}
	defer cli.Close()

	for iteration := 1; iteration <= iterations; iteration++ {
		run(cli, containerId, runtime)
		summary(iteration)
	}

	totalSummary()
}
