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
