package de.qaware.client;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public record ExternalStepList(List<ExternalStep> steps) {
}
