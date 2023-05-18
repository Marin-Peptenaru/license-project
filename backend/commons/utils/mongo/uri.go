package mongo

import (
	"log"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const MongoUri = "mongodb+srv://marin_mongo:NapocaMongo10@licensecluster.skrknve.mongodb.net/?retryWrites=true&w=majority"

func InitDB() {
	err := mgm.SetDefaultConfig(nil, "mgm_db", options.Client().ApplyURI(MongoUri))

	if err != nil {
		log.Fatalf("could not create mgm setup: %s\n", err.Error())
	}
}
