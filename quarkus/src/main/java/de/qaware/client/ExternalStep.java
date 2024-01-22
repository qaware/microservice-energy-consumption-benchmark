package de.qaware.client;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public record ExternalStep(String id, String name, List<String> labels, int durationInMs) {
}
