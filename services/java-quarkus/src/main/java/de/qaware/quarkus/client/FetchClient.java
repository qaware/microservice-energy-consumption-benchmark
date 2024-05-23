package de.qaware.quarkus.client;

import de.qaware.quarkus.client.api.Journal;
import de.qaware.quarkus.client.api.Opera;
import de.qaware.quarkus.client.api.Planet;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.rest.client.annotation.RegisterProvider;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/fetch/{id}")
@RegisterRestClient(configKey = "fetch")
@RegisterProvider(BackendClientRequestFilter.class)
public interface FetchClient {

    @GET
    @Path("/small")
    @Produces(MediaType.APPLICATION_JSON)
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Opera getSmall(@PathParam("id") String id);

    @GET
    @Path("/medium")
    @Produces(MediaType.APPLICATION_JSON)
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Planet getMedium(@PathParam("id") String id);

    @GET
    @Path("/large")
    @Produces(MediaType.APPLICATION_JSON)
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Journal getLarge(@PathParam("id") String id);
}
