package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
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
    protected List<Section> sections;
}
