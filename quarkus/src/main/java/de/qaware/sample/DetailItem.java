package de.qaware.sample;

import jakarta.json.bind.annotation.JsonbProperty;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder(toBuilder = true)
public record DetailItem(
    String id,
    String title,
    String description,
    String status,
    String color,
    int iteration,
    List<Preview> previews,
    List<Step> steps,
    @JsonbProperty("updated_at")
    LocalDateTime updatedAt) {
}
