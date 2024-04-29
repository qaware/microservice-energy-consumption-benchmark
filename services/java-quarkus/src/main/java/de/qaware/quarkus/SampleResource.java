package de.qaware.quarkus;

import de.qaware.quarkus.api.LargeRequest;
import io.smallrye.common.annotation.RunOnVirtualThread;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/sample")
@RolesAllowed("user")
public class SampleResource {

    @Inject
    SampleLogic sampleLogic;

    @GET
    @Path("{id}/small")
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response small(@PathParam("id") String id) {
        return Response.ok(sampleLogic.small(id)).build();
    }

    @GET
    @Path("{id}/medium")
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response medium(@PathParam("id") String id) {
        return Response.ok(sampleLogic.medium(id)).build();
    }

    @POST
    @Path("{id}/large")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response large(@PathParam("id") String id, @NotNull @Valid LargeRequest largeRequest) {
        return Response.ok(sampleLogic.large(id, largeRequest)).build();
    }
}
