package config

import (
	"os"
	"sample-micro-service/pkg/service/log"
	"strconv"
	"strings"
)

// TODO: use viper (https://github.com/spf13/viper)

var (
	logger = log.WithName("config")
)

func GetString(name string) string {
	value, found := findString(name)
	if !found {
		logger.Fatal("Missing value for mandatory configuration property `%v`", name)
	}
	return value
}

func GetOptionalString(name string, defaultValue string) string {
	value, found := findString(name)
	if !found {
		return defaultValue
	}
	return value
}

func GetOptionalInt(name string, defaultValue int) int {
	value, found := findString(name)
	if !found {
		return defaultValue
	}

	number, err := strconv.Atoi(value)
	if err != nil {
		logger.Warn("Invalid number value `%v`", value)
		return defaultValue
	}
	return number
}

func findString(name string) (string, bool) {
	normalized := strings.ToUpper(strings.ReplaceAll(strings.ReplaceAll(name, ".", "_"), "-", "_"))

	return os.LookupEnv(normalized)
}
