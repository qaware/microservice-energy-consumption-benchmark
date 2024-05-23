package de.qaware.spring.sample.client;

import de.qaware.spring.sample.client.api.Journal;
import de.qaware.spring.sample.client.api.Opera;
import de.qaware.spring.sample.client.api.Planet;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "fetch", url = "${backend.fetch.url}", path = "/api/fetch")
public interface FetchClient {

    @GetMapping(value = "/{id}/small", produces = "application/json")
    Opera getSmall(
        @RequestHeader("Authorization") String token,
        @PathVariable("id") String id
    );

    @GetMapping(value = "/{id}/medium", produces = "application/json")
    Planet getMedium(
        @RequestHeader("Authorization") String token,
        @PathVariable("id") String id
    );

    @GetMapping(value = "/{id}/large", produces = "application/json")
    Journal getLarge(
        @RequestHeader("Authorization") String token,
        @PathVariable("id") String id
    );
}
