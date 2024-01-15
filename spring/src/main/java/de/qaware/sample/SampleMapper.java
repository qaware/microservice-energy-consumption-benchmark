package de.qaware.sample;

import de.qaware.client.ExternalStep;
import de.qaware.database.StoredItem;
import de.qaware.database.StoredPreview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SampleMapper {
    @Mapping(source = "updatedAt", target = "updated_at")
    OverviewItem overviewItemOfStoredItem(StoredItem storedItem);

    @Mapping(target = "previews", ignore = true)
    @Mapping(target = "steps", ignore = true)
    @Mapping(source = "updatedAt", target = "updated_at")
    DetailItem detailItemOfStoredItem(StoredItem storedItem);

    @Mapping(source = "createdAt", target = "created_at")
    Preview previewOfStoredPreview(StoredPreview storedPreview);

    @Mapping(source = "durationInMs", target = "duration_in_ms")
    Step stepOfExternalStep(ExternalStep externalStep);
}
