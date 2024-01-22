package de.qaware.sample;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.json.bind.annotation.JsonbProperty;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@RegisterForReflection
public record Preview(
    String id,
    String data,
    @JsonbProperty("created_at")
    LocalDateTime createdAt) {
}
