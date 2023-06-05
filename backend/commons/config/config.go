package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port string `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`

	Database struct {
		Name     string `yaml:"name"`
		Cluster  string `yaml:"cluster"`
		Username string `yaml:"username"`
		Password string `yaml:"password"`
		Options  string `yaml:"options"`
	} `yaml:"database"`

	Security struct {
		TokenSecret string `yaml:"tokensecret"`
	} `yaml:"security"`

	Logging struct {
		FileName   string `yaml:"filename"`
		MaxSize    int    `yaml:"maxsize"`
		MaxBackups int    `yaml:"maxbackups"`
		MaxAge     int    `yaml:"maxage"`
		Compress   bool   `yaml:"compress"`
		Debug      bool   `yaml:"debug"`
	} `yaml:"logging"`

	Redis struct {
		Protocol  string `yaml:"protocol"`
		Url       string `yaml:"url"`
		MaxIdle   int    `yaml:"maxidle"`
		MaxActive int    `yaml:"maxactive"`
		Count     int    `yaml:"count"`
		WaitTime  int    `yaml:"waittime"`
	} `yaml:"redis"`
}

func Load(configFilePath string) *Config {
	f, err := os.Open(configFilePath)

	defer func() {
		err := f.Close()

		if err != nil {
			panic(err)
		}
	}()

	if err != nil {
		panic(err)
	}

	decoder := yaml.NewDecoder(f)

	var cfg Config

	err = decoder.Decode(&cfg)

	if err != nil {
		panic(err)
	}

	return &cfg
}
