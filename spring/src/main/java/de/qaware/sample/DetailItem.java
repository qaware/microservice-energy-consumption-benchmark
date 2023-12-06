package de.qaware.sample;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder(toBuilder = true)
public record DetailItem(
        String id,
        String title,
        String description,
        String status,
        String color,
        int iteration,
        List<Preview> previews,
        List<Step> steps,
        LocalDateTime updated_at) {
}
