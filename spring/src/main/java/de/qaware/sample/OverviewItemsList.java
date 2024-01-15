package de.qaware.sample;

import java.util.List;

public record OverviewItemsList(
        List<OverviewItem> items,
        String next) {
}
