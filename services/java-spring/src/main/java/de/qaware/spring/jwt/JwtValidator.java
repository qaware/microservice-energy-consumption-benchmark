package de.qaware.spring.jwt;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.crypto.factories.DefaultJWSVerifierFactory;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.Set;

@Component
public class JwtValidator {

    private final String expectedIssuer;
    private final String expectedAudience;
    private final JWKSource<SecurityContext> jwkSource;

    public JwtValidator(
        @Value("${auth.jwt.jwks.url}") String jwksUrl,
        @Value("${auth.jwt.expected.issuer}") String expectedIssuer,
        @Value("${auth.jwt.expected.audience}") String expectedAudience
    ) {
        this.expectedIssuer = expectedIssuer;
        this.expectedAudience = expectedAudience;

        try {
            this.jwkSource = JWKSourceBuilder.create(new URI(jwksUrl + "/.well-known/jwks.json").toURL())
                .cache(true)
                .build();
        } catch (URISyntaxException | MalformedURLException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    public JwtUser validate(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(401), "Authorization header is invalid");
        }
        String token = authorizationHeader.substring(7);

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            DefaultJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();
            jwtProcessor.setJWSKeySelector(new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, jwkSource));
            jwtProcessor.setJWSVerifierFactory(new DefaultJWSVerifierFactory());
            jwtProcessor.setJWTClaimsSetVerifier(new DefaultJWTClaimsVerifier<>(
                new JWTClaimsSet.Builder()
                    .issuer(expectedIssuer)
                    .audience(expectedAudience)
                    .build(),
                Set.of("sub", "name", "groups")
            ));

            JWTClaimsSet claimsSet = jwtProcessor.process(signedJWT, null);

            return JwtUser.builder()
                .id(claimsSet.getSubject())
                .name(claimsSet.getStringClaim("name"))
                .token(token)
                .roles(claimsSet.getStringListClaim("groups"))
                .build();
        } catch (ParseException | JOSEException | BadJOSEException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(401), "The bearer token is invalid", e);
        }
    }
}
