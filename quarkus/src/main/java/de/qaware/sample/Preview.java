package de.qaware.sample;

import jakarta.json.bind.annotation.JsonbProperty;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record Preview(
    String id,
    String data,
    @JsonbProperty("created_at")
    LocalDateTime createdAt) {
}
