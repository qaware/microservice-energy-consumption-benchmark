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
public class Section {

    private String title;
    private String summary;
    private Long words;
    @JsonProperty("last_updated_at")
    private OffsetDateTime lastUpdatedAt;
}
