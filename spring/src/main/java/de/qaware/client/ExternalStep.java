package de.qaware.client;

import java.util.List;

public record ExternalStep(String id, String name, List<String> labels, int durationInMs) {
}
