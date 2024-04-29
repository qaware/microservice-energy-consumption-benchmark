package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@RegisterForReflection
public class Journal {

    private String id;
    private String name;
    private String title;
    private Integer issue;
    private String publisher;
    @JsonProperty("published_at")
    private OffsetDateTime publishedAt;
    private List<String> editors;
    private String url;
    private List<Article> articles;
}
