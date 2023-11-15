package de.qaware.database;

import de.qaware.sample.Preview;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StoredPreviewMapper implements RowMapper<StoredPreview> {

    @Override
    public StoredPreview map(ResultSet rs, StatementContext ctx) throws SQLException {
        return StoredPreview.builder()
            .id(rs.getString("id"))
            .data(rs.getString("data"))
            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
            .build();
    }
}
