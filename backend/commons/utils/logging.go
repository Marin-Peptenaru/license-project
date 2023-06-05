package utils

import (
	"commons/config"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var Logger *zap.Logger

func InitLogger(cfg *config.Config) {

	logFile := &lumberjack.Logger{
		Filename:   cfg.Logging.FileName,
		MaxSize:    cfg.Logging.MaxSize,
		MaxBackups: cfg.Logging.MaxBackups,
		MaxAge:     cfg.Logging.MaxAge,
		Compress:   cfg.Logging.Compress,
	}

	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.EncodeCaller = zapcore.ShortCallerEncoder
	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderCfg.LevelKey = "level"
	encoderCfg.MessageKey = "msg"
	encoderCfg.CallerKey = "caller"
	encoderCfg.StacktraceKey = "stacktrace"

	logEncoder := zapcore.NewConsoleEncoder(encoderCfg)

	logLevel := zap.InfoLevel

	if cfg.Logging.Debug {
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

	Logger = zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))
}
