package de.qaware.database;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StoredItem(
    String id,
    String title,
    String description,
    String status,
    String color,
    int iteration,
    LocalDateTime updatedAt) {
}
