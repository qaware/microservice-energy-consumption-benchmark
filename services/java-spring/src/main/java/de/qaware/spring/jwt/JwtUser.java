package de.qaware.spring.jwt;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class JwtUser {

    String id;
    String name;
    String token;
    List<String> roles;
}
