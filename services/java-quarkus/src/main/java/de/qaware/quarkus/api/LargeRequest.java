package de.qaware.quarkus.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@RegisterForReflection
public record LargeRequest(
    @NotNull @Size(min = 10) String value,
    @Min(0) int count,
    @NotNull LocalDateTime timestamp) {
}
