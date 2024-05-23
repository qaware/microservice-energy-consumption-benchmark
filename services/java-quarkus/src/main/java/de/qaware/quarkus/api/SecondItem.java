package de.qaware.quarkus.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.time.OffsetDateTime;

@Builder
@RegisterForReflection
public record SecondItem(
    String name,
    String details,
    OffsetDateTime timestamp,
    int count
) {
}
