package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@RegisterForReflection
public class Article {

    private String title;
    private String description;
    private List<String> authors;
    private List<String> keywords;
    @JsonProperty("from_page")
    private Integer fromPage;
    @JsonProperty("to_page")
    private Integer toPage;
    @JsonProperty("last_updated_at")
    private OffsetDateTime lastUpdatedAt;
    private List<Section> sections;
}
