package de.qaware.quarkus.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.util.List;

@Builder
@RegisterForReflection
public record FirstResponse(
    String id,
    String hash,
    String version,
    String url,
    @JsonProperty("total_number_of_items")
    long totalNumberOfItems,
    @JsonProperty("selected_items")
    List<FirstItem> selectedItems
) {
}
