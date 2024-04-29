package de.qaware.quarkus;

import de.qaware.quarkus.api.LargeRequest;
import de.qaware.quarkus.api.LargeResponse;
import de.qaware.quarkus.api.MediumResponse;
import de.qaware.quarkus.api.SmallItem;
import de.qaware.quarkus.api.SmallResponse;
import de.qaware.quarkus.client.FetchClient;
import de.qaware.quarkus.client.PushClient;
import de.qaware.quarkus.client.api.Article;
import de.qaware.quarkus.client.api.Journal;
import de.qaware.quarkus.client.api.Section;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;


@ApplicationScoped
public class SampleLogic {

    @Inject
    @RestClient
    FetchClient fetchClient;

    @Inject
    @RestClient
    PushClient pushClient;

    SmallResponse small(String id) {
        Journal journal = fetchClient.getLarge(id);

        // some logic that is more than plain mapping
        List<SmallItem> smallItems = defaultList(journal.getArticles())
            .stream()
            .sorted(Comparator.comparing(Article::getTitle))
            .limit(5)
            .map(article -> SmallItem.builder()
                .name(article.getTitle())
                .tags(defaultList(article.getAuthors()).stream().sorted().toList())
                .length(getDifference(article.getFromPage(), article.getToPage()))
                .createdAt(article.getLastUpdatedAt())
                .build())
            .toList();

        // do some computation
        MessageDigest digest = getDigest();
        digest.update(journal.getTitle().getBytes(StandardCharsets.UTF_8));
        for (String editor : defaultList(journal.getEditors())) {
            digest.update(editor.getBytes(StandardCharsets.UTF_8));
        }

        // perform some mapping and aggregation
        return SmallResponse.builder()
            .id(journal.getId())
            .hash(Base64.getEncoder().encodeToString(digest.digest()))
            .version(Integer.toString(journal.getIssue()))
            .url(journal.getUrl())
            .totalNumberOfItems(defaultList(journal.getArticles())
                .stream()
                .flatMap(article -> defaultList(article.getSections()).stream())
                .mapToLong(Section::getWords)
                .sum())
            .selectedItems(smallItems)
            .build();
    }

    private Integer getDifference(Integer from, Integer to) {
        if (from == null && to == null) {
            return null;
        }
        return Math.abs(Objects.requireNonNullElse(from, 0) - Objects.requireNonNullElse(to, 0));
    }

    MediumResponse medium(String id) {
        return new MediumResponse();
    }

    LargeResponse large(String id, LargeRequest request) {
        return new LargeResponse();
    }

    private MessageDigest getDigest() {
        try {
            return MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private static <T> List<T> defaultList(List<T> list) {
        return (list == null) ? Collections.emptyList() : list;
    }
}
