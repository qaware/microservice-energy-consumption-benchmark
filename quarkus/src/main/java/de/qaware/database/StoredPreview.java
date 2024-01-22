package de.qaware.database;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@RegisterForReflection
public record StoredPreview(
    String id,
    String data,
    LocalDateTime createdAt) {
}
