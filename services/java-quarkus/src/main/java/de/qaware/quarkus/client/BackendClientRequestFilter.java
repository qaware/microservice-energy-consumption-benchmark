package de.qaware.quarkus.client;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.ClientRequestContext;
import jakarta.ws.rs.client.ClientRequestFilter;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.eclipse.microprofile.jwt.Claims;

@ApplicationScoped
public class BackendClientRequestFilter implements ClientRequestFilter {

    @Inject
    @Claim(standard = Claims.raw_token)
    ClaimValue<String> userToken;

    @Override
    public void filter(ClientRequestContext requestContext) {
        requestContext.getHeaders().add("Authorization", "Bearer " + userToken);
    }
}
