package de.qaware.sample;

import de.qaware.client.ExternalStep;
import de.qaware.database.StoredItem;
import de.qaware.database.StoredPreview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface SampleMapper {

    OverviewItem overviewItemOfStoredItem(StoredItem storedItem);

    @Mapping(target = "previews", ignore = true)
    @Mapping(target = "steps", ignore = true)
    DetailItem detailItemOfStoredItem(StoredItem storedItem);

    Preview previewOfStoredPreview(StoredPreview storedPreview);

    Step stepOfExternalStep(ExternalStep externalStep);
}
