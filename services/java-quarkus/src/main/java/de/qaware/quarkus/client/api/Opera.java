package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@RegisterForReflection
public class Opera {

    private String id;
    private String composer;
    @JsonProperty("composed_at")
    private OffsetDateTime composedAt;
    @JsonProperty("published_at")
    private OffsetDateTime publishedAt;
    private String description;
    @JsonProperty("number_of_acts")
    private Integer numberOfActs;
    private String style;
    private Boolean title;
}
