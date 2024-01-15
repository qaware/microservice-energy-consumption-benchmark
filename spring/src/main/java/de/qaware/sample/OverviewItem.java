package de.qaware.sample;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record OverviewItem(
        String id,
        String title,
        String description,
        String status,
        String color,
        int iteration,
        LocalDateTime updated_at) {
}
