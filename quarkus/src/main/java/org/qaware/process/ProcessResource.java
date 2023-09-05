package org.qaware.process;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Path("/process")
public class ProcessResource {

    @POST
    @Path("/{key}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response processData(@PathParam("key") String key, ProcessRequest request) {
        ProcessResponse response = ProcessResponse.builder()
                .id(String.format("%s-%s", request.getId(), key))
                .createdAt(OffsetDateTime.now())
                .status(String.format("foo:%s__%s",
                        request.getFrom().format(DateTimeFormatter.ISO_DATE_TIME),
                        request.getTo().format(DateTimeFormatter.ISO_DATE_TIME)))
                .build();

        return Response.ok(response).build();
    }
}