package de.qaware.spring.sample.api;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
public record ThirdItem(
    String details,
    List<String> steps,
    List<String> contents,
    OffsetDateTime timestamp
) {
}
