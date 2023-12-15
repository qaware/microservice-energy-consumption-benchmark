package de.qaware.client;

import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.rest.client.annotation.RegisterProvider;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "steps")
@RegisterProvider(StepClientRequestFilter.class)
public interface StepClient {

    @GET
    @Path("/api/items/{itemId}/steps")
    @CircuitBreaker(skipOn = ClientErrorException.class)
    Response getSteps(@PathParam("itemId") String itemId);
}
