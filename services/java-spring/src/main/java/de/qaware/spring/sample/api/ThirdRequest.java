package de.qaware.spring.sample.api;

import java.time.OffsetDateTime;

public record ThirdRequest(
    String value,
    int count,
    OffsetDateTime timestamp) {
}
