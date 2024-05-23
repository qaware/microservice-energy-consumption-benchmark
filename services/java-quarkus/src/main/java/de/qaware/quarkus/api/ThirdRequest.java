package de.qaware.quarkus.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

@RegisterForReflection
public record ThirdRequest(
    @NotNull @Size(min = 10) String value,
    @Min(0) int count,
    @NotNull OffsetDateTime timestamp) {
}
