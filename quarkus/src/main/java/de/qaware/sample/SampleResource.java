package de.qaware.sample;

import io.smallrye.common.annotation.RunOnVirtualThread;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.eclipse.microprofile.jwt.Claims;

import java.util.Optional;

@Path("/sample")
@RolesAllowed("user")
public class SampleResource {

    @Inject
    @Claim(standard = Claims.sub)
    ClaimValue<String> userId;

    @Inject
    SampleLogic sampleLogic;

    @GET
    @Path("items")
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response getOverview(
        @QueryParam("from") String from,
        @QueryParam("limit") @DefaultValue("10") int limit
    ) {
        return Response.ok(sampleLogic.getItems(userId.getValue(), from, limit)).build();
    }

    @GET
    @Path("items/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RunOnVirtualThread
    public Response getDetails(@PathParam("id") String id) {
        Optional<DetailItem> optionalDetailItem = sampleLogic.getDetailItem(userId.getValue(), id);

        if (optionalDetailItem.isPresent()) {
            return Response.ok(optionalDetailItem.get()).build();
        } else {
            return Response.status(404).build();
        }
    }
}
