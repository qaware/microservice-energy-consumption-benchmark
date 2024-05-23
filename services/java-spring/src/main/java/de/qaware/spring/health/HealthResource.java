package de.qaware.spring.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthResource {

    @GetMapping(produces = "application/json")
    public ResponseEntity<HealthResponse> health() {
        return ResponseEntity.ok(new HealthResponse());
    }

    @GetMapping(value = "started", produces = "application/json")
    public ResponseEntity<HealthResponse> started() {
        return ResponseEntity.ok(new HealthResponse());
    }

    @GetMapping(value = "live", produces = "application/json")
    public ResponseEntity<HealthResponse> live() {
        return ResponseEntity.ok(new HealthResponse());
    }

    @GetMapping(value = "ready", produces = "application/json")
    public ResponseEntity<HealthResponse> ready() {
        return ResponseEntity.ok(new HealthResponse());
    }
}
