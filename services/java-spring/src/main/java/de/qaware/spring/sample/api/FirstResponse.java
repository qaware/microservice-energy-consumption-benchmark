package de.qaware.spring.sample.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@Builder
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
