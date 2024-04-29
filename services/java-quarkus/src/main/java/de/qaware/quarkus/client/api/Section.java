package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@RegisterForReflection
public class Section {

    private String title;
    private String summary;
    private Long words;
    @JsonProperty("last_updated_at")
    private OffsetDateTime lastUpdatedAt;
}
