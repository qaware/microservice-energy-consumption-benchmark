package de.qaware.quarkus;

import de.qaware.quarkus.api.ThirdRequest;
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
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.eclipse.microprofile.jwt.Claims;

@Path("/sample")
@RolesAllowed("user")
public class SampleResource {

    @Inject
    @Claim(standard = Claims.sub)
    ClaimValue<String> userId;

    @Inject
    SampleLogic sampleLogic;

    @GET
    @Path("{id}/first")
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response first(@PathParam("id") String id) {
        return Response.ok(sampleLogic.first(userId.getValue(), id)).build();
    }

    @GET
    @Path("{id}/second")
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response second(@PathParam("id") String id) {
        return Response.ok(sampleLogic.second(userId.getValue(), id)).build();
    }

    @POST
    @Path("{id}/third")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response third(@PathParam("id") String id, @NotNull @Valid ThirdRequest thirdRequest) {
        return Response.ok(sampleLogic.third(userId.getValue(), id, thirdRequest)).build();
    }
}
