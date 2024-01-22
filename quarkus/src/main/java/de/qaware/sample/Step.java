package de.qaware.sample;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.json.bind.annotation.JsonbProperty;

import java.util.List;

@RegisterForReflection
public record Step(
    String name,
    List<String> labels,
    @JsonbProperty("duration_in_ms")
    int durationInMs) {
}
