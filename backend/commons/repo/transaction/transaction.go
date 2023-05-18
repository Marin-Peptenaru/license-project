package transaction

import (
	"context"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo"
)

type Scope interface {
	Ctx() context.Context
	Commit() error
	Abort() error
}

type mgmTransaction struct {
	session        mongo.Session
	transactionCtx mongo.SessionContext
}

func (m *mgmTransaction) Ctx() context.Context {
	return m.transactionCtx
}

func (m *mgmTransaction) Commit() error {
	return m.session.CommitTransaction(m.transactionCtx)
}

func (m *mgmTransaction) Abort() error {
	return m.session.AbortTransaction(m.transactionCtx)
}

func Do(operations func(s Scope) error) error {

	return mgm.Transaction(func(session mongo.Session, ctx mongo.SessionContext) error {
		mgmTxScope := &mgmTransaction{
			session:        session,
			transactionCtx: ctx,
		}

		return operations(mgmTxScope)
	})

}
