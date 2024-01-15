package de.qaware.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "steps", url = "${steps.url}")
public interface StepClient {

    @GetMapping("/api/items/{itemId}/steps")
    ResponseEntity<ExternalStepList> getSteps(@PathVariable("itemId") String itemId);
}