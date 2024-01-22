package de.qaware.database;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@RegisterForReflection
public record StoredItem(
    String id,
    String title,
    String description,
    String status,
    String color,
    int iteration,
    LocalDateTime updatedAt) {
}
