package de.qaware.quarkus.api;

import lombok.Builder;

import java.time.OffsetDateTime;

@Builder
public record SecondItem(
    String name,
    String details,
    OffsetDateTime timestamp,
    int count
) {
}
