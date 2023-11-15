package de.qaware.database;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import lombok.extern.slf4j.Slf4j;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.statement.Slf4JSqlLogger;
import org.jdbi.v3.postgres.PostgresPlugin;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;

import javax.sql.DataSource;

@Slf4j
@ApplicationScoped
public class JdbiProducer {

    @Inject
    DataSource dataSource;

    @Produces
    @ApplicationScoped
    Jdbi getJdbi() {
        Jdbi jdbi = Jdbi.create(dataSource);

        // The SQL-object plugin allows a more declarative access to the database.
        jdbi.installPlugin(new SqlObjectPlugin());

        // The SQL logger gives insights into executed SQL queries on DEBUG level.
        jdbi.setSqlLogger(new Slf4JSqlLogger(LOGGER));

        // The Postgres plugin adds mapping support for common data types.
        jdbi.installPlugin(new PostgresPlugin());

        return jdbi;
    }
}
