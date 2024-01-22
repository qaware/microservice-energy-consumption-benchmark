package de.qaware.sample;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.json.bind.annotation.JsonbProperty;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@RegisterForReflection
public record OverviewItem(
    String id,
    String title,
    String description,
    String status,
    String color,
    int iteration,
    @JsonbProperty("updated_at")
    LocalDateTime updatedAt) {
}
