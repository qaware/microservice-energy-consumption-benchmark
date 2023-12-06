package de.qaware.database;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoredItemRepository extends JpaRepository<StoredItem, String> {
    List<StoredItem> findByUserIdOrderByUpdatedAt(String userId, Pageable pageable);

    List<StoredItem> findByUserIdAndIdGreaterThanEqualOrderByUpdatedAt(String userId, String fromId, Pageable pageable);

    Optional<StoredItem> findByIdAndUserId(String itemId, String userId);
}
