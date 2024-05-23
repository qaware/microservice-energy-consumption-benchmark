package de.qaware.quarkus.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;
import lombok.Singular;

import java.util.List;

@Builder
@RegisterForReflection
public record SecondResponse(
    boolean relevant,
    boolean omit,
    String description,
    long weight,
    @Singular
    List<SecondItem> items
) {
}
