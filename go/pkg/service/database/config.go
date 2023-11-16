package database

import (
	"context"
	"database/sql"
	_ "github.com/jackc/pgx/v4/stdlib"
	"sample-micro-service/pkg/service/config"
	"sample-micro-service/pkg/service/log"
)

var (
	logger = log.WithName("database")
	Db     *sql.DB
)

func init() {
	var err error
	Db, err = sql.Open("pgx", config.GetString("db_connection"))
	if err != nil {
		logger.FatalOnError(err, "Failed to open connection to database")
	}
	Db.SetMaxOpenConns(50)
}

func InTransaction(c context.Context, action func() error) error {
	tx, err := Db.BeginTx(c, &sql.TxOptions{Isolation: sql.LevelSerializable})
	if err != nil {
		return err
	}

	err = action()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
