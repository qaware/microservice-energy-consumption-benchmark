package de.qaware.spring.sample;

import de.qaware.spring.jwt.JwtUser;
import de.qaware.spring.jwt.JwtValidator;
import de.qaware.spring.sample.api.FirstResponse;
import de.qaware.spring.sample.api.SecondResponse;
import de.qaware.spring.sample.api.ThirdRequest;
import de.qaware.spring.sample.api.ThirdResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sample")
@RequiredArgsConstructor
public class SampleResource {

    private final JwtValidator jwtValidator;
    private final SampleLogic sampleLogic;

    @GetMapping(value = "{id}/first", produces = "application/json")
    public ResponseEntity<FirstResponse> first(
        @RequestHeader("Authorization") String authorization,
        @PathVariable("id") String id
    ) {
        JwtUser jwtUser = jwtValidator.validate(authorization);
        return ResponseEntity.ok(sampleLogic.first(jwtUser, id));
    }

    @GetMapping(value = "{id}/second", produces = "application/json")
    public ResponseEntity<SecondResponse> second(
        @RequestHeader("Authorization") String authorization,
        @PathVariable("id") String id
    ) {
        JwtUser jwtUser = jwtValidator.validate(authorization);
        return ResponseEntity.ok(sampleLogic.second(jwtUser, id));
    }

    @PostMapping(value = "{id}/third", consumes = "application/json", produces = "application/json")
    public ResponseEntity<ThirdResponse> third(
        @RequestHeader("Authorization") String authorization,
        @PathVariable("id") String id,
        @RequestBody ThirdRequest thirdRequest
    ) {
        JwtUser jwtUser = jwtValidator.validate(authorization);
        return ResponseEntity.ok(sampleLogic.third(jwtUser, id, thirdRequest));
    }

    private JwtUser jwtUser(String authorization) {
        return jwtValidator.validate(authorization);
    }
}
