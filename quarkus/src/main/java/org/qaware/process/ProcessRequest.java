package org.qaware.process;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public final class ProcessRequest {

    private String id;
    private OffsetDateTime from;
    private OffsetDateTime to;
}
