package de.qaware.quarkus.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
@RegisterForReflection
public record ThirdItem(
    String details,
    List<String> steps,
    List<String> contents,
    OffsetDateTime timestamp
) {
}
