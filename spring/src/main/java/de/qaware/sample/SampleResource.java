package de.qaware.sample;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

//@Secured("ROLE_user")
@Slf4j
@RestController
@RequestMapping("/sample")
@RequiredArgsConstructor
public class SampleResource {

    private final SampleLogic sampleLogic;

    @GetMapping("/items")
    public ResponseEntity<OverviewItemsList> getOverview(
            @RequestParam(name = "from", required = false) String from,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        log.debug("called getOverview with from={}, limit={}", from, limit);

        return ResponseEntity.ok(sampleLogic.getItems(userId().orElse(null), from, limit));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<DetailItem> getDetails(@PathVariable String id) {
        Optional<DetailItem> optionalDetailItem = sampleLogic.getDetailItem(userId().orElse(null), id);

        log.debug("called getDetails with id={}", id);

        return optionalDetailItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private Optional<String> userId() {
//        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication().getName());
        return Optional.of("user-01");
    }
}
