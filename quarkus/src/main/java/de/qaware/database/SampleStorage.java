package de.qaware.database;

import org.jdbi.v3.sqlobject.config.RegisterRowMapper;
import org.jdbi.v3.sqlobject.statement.SqlQuery;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public interface SampleStorage {

    @SqlQuery("SELECT id, title, description, status, color, iteration, updated_at FROM quarkus.items WHERE user_id = :userId ORDER BY id LIMIT :limit")
    @RegisterRowMapper(StoredItemMapper.class)
    Stream<StoredItem> getItemsForUser(String userId, int limit);

    @SqlQuery("SELECT id, title, description, status, color, iteration, updated_at FROM quarkus.items WHERE user_id = :userId AND id >= :fromId ORDER BY id LIMIT :limit")
    @RegisterRowMapper(StoredItemMapper.class)
    Stream<StoredItem> getItemsForUserFromId(String userId, String fromId, int limit);

    @SqlQuery("SELECT id, title, description, status, color, iteration, updated_at FROM quarkus.items WHERE id = :itemId AND user_id = :userId")
    @RegisterRowMapper(StoredItemMapper.class)
    Optional<StoredItem> getItemForUser(String userId, String itemId);

    @SqlQuery("SELECT id, data, created_at FROM quarkus.previews WHERE item_id = :itemId")
    @RegisterRowMapper(StoredPreviewMapper.class)
    Stream<StoredPreview> getPreviewsForItem(String itemId);
}
