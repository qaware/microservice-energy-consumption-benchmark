package de.qaware.sample;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.json.bind.annotation.JsonbProperty;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder(toBuilder = true)
@RegisterForReflection
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
