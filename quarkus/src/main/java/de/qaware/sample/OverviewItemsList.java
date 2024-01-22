package de.qaware.sample;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public record OverviewItemsList(
    List<OverviewItem> items,
    String next) {
}
