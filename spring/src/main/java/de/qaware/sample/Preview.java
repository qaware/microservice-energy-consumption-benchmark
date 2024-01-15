package de.qaware.sample;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record Preview(
        String id,
        String data,
        LocalDateTime created_at) {
}
