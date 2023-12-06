package de.qaware.sample;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@RequestMapping("/sample")
@Secured("ROLE_user")
@Component
@RequiredArgsConstructor
public class SampleResource {

    private SampleLogic sampleLogic;

    @GetMapping("/items")
    public ResponseEntity<OverviewItemsList> getOverview(
            @RequestParam(name = "from", required = false) String from,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(sampleLogic.getItems(userId().orElse(null), from, limit));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<DetailItem> getDetails(@PathVariable String id) {
        Optional<DetailItem> optionalDetailItem = sampleLogic.getDetailItem(userId().orElse(null), id);

        return optionalDetailItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private Optional<String> userId() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
