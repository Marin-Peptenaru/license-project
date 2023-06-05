package mongo

import (
	"commons/config"
	"commons/utils"
	"fmt"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

const mongoUriFormat = "mongodb+srv://%s:%s@%s/?%s"

func InitDB(cfg *config.Config) {

	var uri = fmt.Sprintf(mongoUriFormat,
		cfg.Database.Username,
		cfg.Database.Password,
		cfg.Database.Cluster,
		cfg.Database.Options,
	)

	err := mgm.SetDefaultConfig(nil, cfg.Database.Name, options.Client().ApplyURI(uri))

	if err != nil {
		utils.Logger.Panic("could not init database", zap.Error(err))
	}
}
