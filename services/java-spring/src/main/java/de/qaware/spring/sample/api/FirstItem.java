package de.qaware.spring.sample.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
public record FirstItem(
    String name,
    List<String> tags,
    Integer length,
    @JsonProperty("created_at")
    OffsetDateTime createdAt
) {
}
