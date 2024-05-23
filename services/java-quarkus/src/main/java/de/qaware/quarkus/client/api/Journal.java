package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
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
    @Singular
    private List<Article> articles;
}
