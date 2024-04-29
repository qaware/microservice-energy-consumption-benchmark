package de.qaware.quarkus.client.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@RegisterForReflection
public class Planet {

    private String id;
    private String name;
    private Integer diameter;
    private Integer orbit;
    private Boolean gas;
    @JsonProperty("discovered_at")
    private OffsetDateTime discoveredAt;
    @JsonProperty("discovered_by")
    private String discoveredBy;
    private String history;
    private List<String> missions;
    private List<Moon> moons;
}
