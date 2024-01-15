package de.qaware.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoredPreviewRepository extends JpaRepository<StoredPreview, String> {
    List<StoredPreview> findByItemId(String itemId);
}