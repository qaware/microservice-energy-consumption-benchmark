package de.qaware.database;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StoredPreview(
    String id,
    String data,
    LocalDateTime createdAt) {
}
