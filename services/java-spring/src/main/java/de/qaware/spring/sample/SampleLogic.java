package de.qaware.spring.sample;

import de.qaware.spring.jwt.JwtUser;
import de.qaware.spring.sample.api.FirstItem;
import de.qaware.spring.sample.api.FirstResponse;
import de.qaware.spring.sample.api.SecondItem;
import de.qaware.spring.sample.api.SecondResponse;
import de.qaware.spring.sample.api.ThirdItem;
import de.qaware.spring.sample.api.ThirdRequest;
import de.qaware.spring.sample.api.ThirdResponse;
import de.qaware.spring.sample.client.FetchClient;
import de.qaware.spring.sample.client.PushClient;
import de.qaware.spring.sample.client.api.Article;
import de.qaware.spring.sample.client.api.Journal;
import de.qaware.spring.sample.client.api.Moon;
import de.qaware.spring.sample.client.api.Opera;
import de.qaware.spring.sample.client.api.Planet;
import de.qaware.spring.sample.client.api.Section;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SampleLogic {

    private final FetchClient fetchClient;
    private final PushClient pushClient;

    FirstResponse first(JwtUser jwtUser, String id) {
        Journal journal = fetchClient.getLarge(getToken(jwtUser), jwtUser.getId() + "++" + id);

        // some logic that is more than plain mapping
        List<FirstItem> firstItems = defaultList(journal.getArticles())
            .stream()
            .sorted(Comparator.comparing(Article::getTitle))
            .limit(5)
            .map(article -> FirstItem.builder()
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
        return FirstResponse.builder()
            .id(journal.getId())
            .hash(Base64.getEncoder().encodeToString(digest.digest()))
            .version(Integer.toString(journal.getIssue()))
            .url(journal.getUrl())
            .totalNumberOfItems(defaultList(journal.getArticles())
                .stream()
                .flatMap(article -> defaultList(article.getSections()).stream())
                .mapToLong(Section::getWords)
                .sum())
            .selectedItems(firstItems)
            .build();
    }

    private Integer getDifference(Integer from, Integer to) {
        if (from == null && to == null) {
            return null;
        }
        return Math.abs(Objects.requireNonNullElse(from, 0) - Objects.requireNonNullElse(to, 0));
    }

    SecondResponse second(JwtUser jwtUser, String id) {
        Planet planet = fetchClient.getMedium(getToken(jwtUser), jwtUser.getId() + "++sec-" + id);
        String name1 = getName(planet.getMoons(), 0);
        String name2 = getName(planet.getMoons(), 1);
        String name3 = getName(planet.getMoons(), 2);

        Opera opera1 = fetchClient.getSmall(getToken(jwtUser), "foo_" + name1);
        Opera opera2 = fetchClient.getSmall(getToken(jwtUser), "bar_" + name2);
        Opera opera3 = fetchClient.getSmall(getToken(jwtUser), "quz_" + name3);

        return SecondResponse.builder()
            .relevant(defaultList(planet.getMissions())
                .stream()
                .anyMatch(m -> m.contains("f")))
            .omit(planet.getGas() == null || !planet.getGas())
            .description(defaultList(planet.getMoons())
                .stream()
                .map(Moon::getName)
                .collect(Collectors.joining("--")))
            .weight(planet.getDiameter() + planet.getOrbit())
            .item(SecondItem.builder()
                .name(name1)
                .details(opera1.getStyle())
                .timestamp(opera1.getComposedAt())
                .count(opera1.getNumberOfActs())
                .build())
            .item(SecondItem.builder()
                .name(name2)
                .details(opera2.getStyle())
                .timestamp(opera2.getComposedAt())
                .count(opera2.getNumberOfActs())
                .build())
            .item(SecondItem.builder()
                .name(name1)
                .details(opera3.getStyle())
                .timestamp(opera3.getComposedAt())
                .count(opera3.getNumberOfActs())
                .build())
            .build();
    }

    private String getName(List<Moon> moons, int index) {
        if (moons == null || index >= moons.size()) {
            return "(none)";
        }
        Moon moon = moons.get(index);
        return Objects.requireNonNullElse(moon.getName(), "(none)");
    }

    ThirdResponse third(JwtUser jwtUser, String id, ThirdRequest request) {
        Opera result1 = pushClient.postSmall(getToken(jwtUser), "a.10:" + id, Opera.builder()
            .name("first " + request.value())
            .composedAt(request.timestamp())
            .numberOfActs(10)
            .build());

        Opera result2 = pushClient.postSmall(getToken(jwtUser), "a.20:" + id, Opera.builder()
            .name("second " + request.value())
            .composedAt(request.timestamp())
            .numberOfActs(20)
            .build());

        Journal journal = pushClient.postLarge(getToken(jwtUser), jwtUser.getId() + "++xg.3.f4:" + id, Journal.builder()
            .name(request.value())
            .issue(request.count())
            .article(Article.builder()
                .title(result1.getName())
                .lastUpdatedAt(result1.getComposedAt())
                .build())
            .article(Article.builder()
                .title(result2.getName())
                .lastUpdatedAt(result2.getComposedAt())
                .build())
            .build());

        return ThirdResponse.builder()
            .name(journal.getName())
            .description(journal.getTitle() + " " +
                Objects.requireNonNullElse(journal.getPublisher(), "") + " " +
                Objects.requireNonNullElse(journal.getUrl(), ""))
            .createdAt(journal.getPublishedAt())
            .lastUpdatedAt(defaultList(journal.getArticles())
                .stream()
                .map(Article::getLastUpdatedAt)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElseGet(OffsetDateTime::now))
            .labels(defaultList(journal.getEditors())
                .stream()
                .map(s -> "- " + s)
                .toList())
            .totalCount(defaultList(journal.getArticles())
                .stream()
                .mapToInt(article -> defaultList(article.getSections()).size())
                .sum())
            .items(defaultList(journal.getArticles())
                .stream()
                .map(article -> ThirdItem.builder()
                    .details(article.getDescription())
                    .steps(article.getAuthors())
                    .contents(defaultList(article.getSections())
                        .stream()
                        .map(Section::getSummary)
                        .toList())
                    .timestamp(article.getLastUpdatedAt())
                    .build())
                .toList())
            .build();
    }

    private MessageDigest getDigest() {
        try {
            return MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private static String getToken(JwtUser jwtUser) {
        return "Bearer " + jwtUser.getToken();
    }

    private static <T> List<T> defaultList(List<T> list) {
        return (list == null) ? Collections.emptyList() : list;
    }
}
