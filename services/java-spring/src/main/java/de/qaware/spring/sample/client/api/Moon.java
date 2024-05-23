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
public class Moon {

    private String name;
    private Integer diameter;
    private Long distance;
    @JsonProperty("discovered_at")
    private OffsetDateTime discoveredAt;
    @JsonProperty("discovered_by")
    private String discoveredBy;
    @JsonProperty("possible_life")
    private Boolean possibleLife;
}
