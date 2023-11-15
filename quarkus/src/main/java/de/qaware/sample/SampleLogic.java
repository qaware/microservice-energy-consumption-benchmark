package de.qaware.sample;

import de.qaware.client.ExternalStepList;
import de.qaware.client.StepClient;
import de.qaware.database.SampleStorage;
import de.qaware.database.StoredItem;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.Jdbi;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@ApplicationScoped
public class SampleLogic {

    @Inject
    Jdbi jdbi;

    @Inject
    SampleMapper sampleMapper;

    @Inject
    @RestClient
    StepClient stepClient;

    OverviewItemsList getItems(String userId, String fromId, int limit) {
        try (Handle handle = jdbi.open()) {
            SampleStorage sampleStorage = handle.attach(SampleStorage.class);
            Stream<StoredItem> storedItemStream;

            if (fromId == null || fromId.isEmpty()) {
                storedItemStream = sampleStorage.getItemsForUser(userId, limit + 1);
            } else {
                storedItemStream = sampleStorage.getItemsForUserFromId(userId, fromId, limit + 1);
            }

            List<OverviewItem> items = storedItemStream.map(sampleMapper::overviewItemOfStoredItem).toList();

            return new OverviewItemsList(
                items.subList(0, Math.min(items.size(), limit)),
                (items.size() > limit) ? items.get(limit).id() : null
            );
        }
    }

    Optional<DetailItem> getDetailItem(String userId, String itemId) {
        try (Handle handle = jdbi.open()) {
            SampleStorage sampleStorage = handle.attach(SampleStorage.class);

            return sampleStorage.getItemForUser(userId, itemId)
                .map(sampleMapper::detailItemOfStoredItem)
                .map(item -> item.toBuilder()
                    .previews(sampleStorage.getPreviewsForItem(itemId)
                        .map(sampleMapper::previewOfStoredPreview)
                        .toList())
                    .steps(getSteps(itemId))
                    .build());
        }
    }

    private List<Step> getSteps(String itemId) {
        try (Response response = stepClient.getSteps(itemId)) {
            return response.readEntity(ExternalStepList.class).steps()
                .stream()
                .map(sampleMapper::stepOfExternalStep)
                .toList();
        } catch (WebApplicationException | ProcessingException e) {
            LOGGER.warn("Failed to get steps for item {}", itemId, e);
            return Collections.emptyList();
        }
    }
}
