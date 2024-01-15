package de.qaware.sample;

import java.util.List;

public record Step(
        String name,
        List<String> labels,
        int duration_in_ms) {
}
