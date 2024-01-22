package de.qaware.database;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.sql.ResultSet;
import java.sql.SQLException;

@RegisterForReflection
public class StoredItemMapper implements RowMapper<StoredItem> {

    @Override
    public StoredItem map(ResultSet rs, StatementContext ctx) throws SQLException {
        return StoredItem.builder()
            .id(rs.getString("id"))
            .title(rs.getString("title"))
            .description(rs.getString("description"))
            .status(rs.getString("status"))
            .color(rs.getString("color"))
            .iteration(rs.getInt("iteration"))
            .updatedAt(rs.getTimestamp("updated_at").toLocalDateTime())
            .build();
    }
}
