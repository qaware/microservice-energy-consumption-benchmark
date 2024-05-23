package de.qaware.quarkus.client;

import de.qaware.quarkus.client.api.Journal;
import de.qaware.quarkus.client.api.Opera;
import de.qaware.quarkus.client.api.Planet;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.rest.client.annotation.RegisterProvider;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/push/{id}")
@RegisterRestClient(configKey = "push")
@RegisterProvider(BackendClientRequestFilter.class)
public interface PushClient {

    @POST
    @Path("/small")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Opera postSmall(@PathParam("id") String id, Opera body);

    @POST
    @Path("/medium")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Planet postMedium(@PathParam("id") String id, Planet body);

    @POST
    @Path("/large")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Journal postLarge(@PathParam("id") String id, Journal body);
}
