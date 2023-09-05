package org.qaware.process;

import lombok.Builder;
import lombok.Data;

import javax.json.bind.annotation.JsonbProperty;
import java.time.OffsetDateTime;

@Data
@Builder
public class ProcessResponse {

    private String id;
    @JsonbProperty("created_at")
    private OffsetDateTime createdAt;
    private String status;
}
