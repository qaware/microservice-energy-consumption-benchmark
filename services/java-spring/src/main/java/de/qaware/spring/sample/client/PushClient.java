package de.qaware.spring.sample.client;

import de.qaware.spring.sample.client.api.Journal;
import de.qaware.spring.sample.client.api.Opera;
import de.qaware.spring.sample.client.api.Planet;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "push", url = "${backend.push.url}", path = "/api/push")
public interface PushClient {

    @PostMapping(value = "/{id}/small", consumes = "application/json", produces = "application/json")
    Opera postSmall(
        @RequestHeader("Authorization") String token,
        @PathVariable("id") String id,
        Opera body
    );

    @PostMapping(value = "/{id}/medium", consumes = "application/json", produces = "application/json")
    Planet postMedium(
        @RequestHeader("Authorization") String token,
        @PathVariable("id") String id,
        Planet body
    );

    @PostMapping(value = "/{id}/large", consumes = "application/json", produces = "application/json")
    Journal postLarge(
        @RequestHeader("Authorization") String token,
        @PathVariable("id") String id,
        Journal body);
}
