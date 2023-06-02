package utils

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var logger *zap.Logger

func InitLogger(debug bool) {

	logFile := &lumberjack.Logger{
		Filename:   "log.txt",
		MaxSize:    512,
		MaxBackups: 3,
		MaxAge:     1,
		Compress:   false,
	}

	encoderConf := zap.NewProductionEncoderConfig()
	encoderConf.EncodeCaller = zapcore.ShortCallerEncoder
	encoderConf.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConf.LevelKey = "level"
	encoderConf.MessageKey = "msg"
	encoderConf.CallerKey = "caller"
	encoderConf.StacktraceKey = "stacktrace"

	logEncoder := zapcore.NewConsoleEncoder(encoderConf)

	logLevel := zap.InfoLevel

	if debug {
		logLevel = zap.DebugLevel
	}

	core := zapcore.NewCore(
		logEncoder,
		zap.CombineWriteSyncers(
			zapcore.AddSync(logFile),
			zapcore.AddSync(os.Stdout),
		),
		logLevel,
	)

	logger = zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))
}

func Logger() *zap.Logger {
	return logger
}
