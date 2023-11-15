package log

import (
	"fmt"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"os"
	"time"
)

type Logger struct {
	logger zerolog.Logger
}

func init() {
	zerolog.TimestampFunc = time.Now().UTC
	zerolog.TimeFieldFormat = time.RFC3339
	zerolog.MessageFieldName = "message"
	zerolog.TimestampFieldName = "@timestamp"
	zerolog.LevelFieldName = "log.level"
	zerolog.CallerFieldName = "log.origin.file.name"

	logLevelName, found := os.LookupEnv("LOG_LEVEL")
	if !found {
		logLevelName = "info"
	}
	zerolog.SetGlobalLevel(asLogLevel(logLevelName))
}

func asLogLevel(logLevelName string) zerolog.Level {
	switch logLevelName {
	case "debug":
		return zerolog.DebugLevel
	case "info":
		return zerolog.InfoLevel
	case "warn":
		return zerolog.WarnLevel
	case "error":
		return zerolog.ErrorLevel
	default:
		return zerolog.InfoLevel
	}
}

func WithName(loggerName string) Logger {
	return Logger{logger: log.With().Caller().Str("log.logger", loggerName).Logger()}
}

func (logger *Logger) Debug(format string, arguments ...interface{}) {
	logger.logger.Debug().Msgf(format, arguments...)
}

func (logger *Logger) Info(format string, arguments ...interface{}) {
	logger.logger.Info().Msgf(format, arguments...)
}

func (logger *Logger) Warn(format string, arguments ...interface{}) {
	logger.logger.Warn().Msgf(format, arguments...)
}

func (logger *Logger) Error(format string, arguments ...interface{}) {
	logger.logger.Error().Msgf(format, arguments...)
}

func (logger *Logger) ErrorOnError(err error, format string, arguments ...interface{}) {
	message := format
	if len(arguments) > 0 {
		message = fmt.Sprintf(format, arguments...)
	}

	logger.logger.Error().Err(err).Msgf("%v: %v", message, err.Error())
}

func (logger *Logger) Fatal(format string, arguments ...interface{}) {
	logger.logger.Fatal().Msgf(format, arguments...)
}

func (logger *Logger) FatalOnError(err error, format string, arguments ...interface{}) {
	message := format
	if len(arguments) > 0 {
		message = fmt.Sprintf(format, arguments...)
	}

	logger.logger.Fatal().Err(err).Msgf("%v: %v", message, err.Error())
}
