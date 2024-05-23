package de.qaware.spring.sample.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
public record ThirdResponse(
    String name,
    String description,
    @JsonProperty("created_at")
    OffsetDateTime createdAt,
    @JsonProperty("last_updated_at")
    OffsetDateTime lastUpdatedAt,
    List<String> labels,
    @JsonProperty("total_count")
    long totalCount,
    List<ThirdItem> items
) {
}
