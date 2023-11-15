package de.qaware.sample;

import jakarta.json.bind.annotation.JsonbProperty;

import java.util.List;

public record Step(
    String name,
    List<String> labels,
    @JsonbProperty("duration_in_ms")
    int durationInMs) {
}
