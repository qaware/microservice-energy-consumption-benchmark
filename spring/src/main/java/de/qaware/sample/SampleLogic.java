package de.qaware.sample;

import de.qaware.client.ExternalStepList;
import de.qaware.client.StepClient;
import de.qaware.database.StoredItem;
import de.qaware.database.StoredItemRepository;
import de.qaware.database.StoredPreviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class SampleLogic {
    private StoredItemRepository storedItemRepository;
    private StoredPreviewRepository storedPreviewRepository;
    private SampleMapper sampleMapper;
    private StepClient stepClient;

    OverviewItemsList getItems(String userId, String fromId, int limit) {
        List<StoredItem> storedItemList;

        if (fromId == null || fromId.isEmpty()) {
            storedItemList = storedItemRepository.findByUserIdOrderByUpdatedAt(userId, Pageable.ofSize(limit + 1));
        } else {
            storedItemList = storedItemRepository.findByUserIdAndIdGreaterThanEqualOrderByUpdatedAt(userId, fromId, Pageable.ofSize(limit + 1));
        }

        List<OverviewItem> items = storedItemList.stream().map(sampleMapper::overviewItemOfStoredItem).toList();

        return new OverviewItemsList(items.subList(0, Math.min(items.size(), limit)), (items.size() > limit) ? items.get(limit).id() : null);
    }

    Optional<DetailItem> getDetailItem(String userId, String itemId) {
        return storedItemRepository.findByIdAndUserId(itemId, userId)
                .map(sampleMapper::detailItemOfStoredItem)
                .map(item -> item.toBuilder()
                        .previews(
                                storedPreviewRepository.findByItemId(itemId)
                                        .stream()
                                        .map(sampleMapper::previewOfStoredPreview)
                                        .toList()
                        ).steps(getSteps(itemId))
                        .build()
                );
    }

    private List<Step> getSteps(String itemId) {
        ResponseEntity<ExternalStepList> response = stepClient.getSteps(itemId);
        return Objects.requireNonNull(response.getBody()).steps().stream().map(sampleMapper::stepOfExternalStep).toList();
    }
}
