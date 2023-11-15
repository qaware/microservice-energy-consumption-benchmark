package de.qaware.sample;

import jakarta.json.bind.annotation.JsonbProperty;
import lombok.Builder;
import lombok.Singular;

import java.time.LocalDateTime;
import java.util.List;

@Builder
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
