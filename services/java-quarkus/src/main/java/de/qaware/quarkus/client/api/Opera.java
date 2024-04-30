package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@RegisterForReflection
public class Opera {

    private String id;
    private String name;
    private String composer;
    @JsonProperty("composed_at")
    private OffsetDateTime composedAt;
    @JsonProperty("published_at")
    private OffsetDateTime publishedAt;
    private String description;
    @JsonProperty("number_of_acts")
    private Integer numberOfActs;
    private String style;
    @JsonProperty("open_air")
    private Boolean openAir;
}
