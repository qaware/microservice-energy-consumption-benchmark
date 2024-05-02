package de.qaware.spring.sample.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
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
