package de.qaware.spring.sample.api;

import lombok.Builder;
import lombok.Singular;

import java.util.List;

@Builder
public record SecondResponse(
    boolean relevant,
    boolean omit,
    String description,
    long weight,
    @Singular
    List<SecondItem> items
) {
}
