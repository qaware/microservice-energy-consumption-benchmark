package de.qaware.quarkus.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
@RegisterForReflection
public record SmallItem(
    String name,
    List<String> tags,
    Integer length,
    @JsonProperty("created_at")
    OffsetDateTime createdAt
) {
}
