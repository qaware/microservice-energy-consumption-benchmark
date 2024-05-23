import { Injectable } from '@nestjs/common';
import { BackendService } from '../backend/backend.service';
import {
  SampleThirdResponse,
  SampleThirdResponseBuilder,
} from './api/sample.third.response';
import {
  SampleFirstResponse,
  SampleFirstResponseBuilder,
} from './api/sample.first.response';
import {
  SampleSecondResponse,
  SampleSecondResponseBuilder,
} from './api/sample.second.response';
import { SampleThirdRequest } from './api/sample.third.request';
import { SampleFirstItemBuilder } from './api/sample.first.item';
import * as crypto from 'node:crypto';
import { BackendMoon } from '../backend/api/backend.moon';
import { SampleSecondItemBuilder } from './api/sample.second.item';
import { BackendOperaBuilder } from '../backend/api/backend.opera';
import { BackendJournalBuilder } from '../backend/api/backend.journal';
import { BackendArticleBuilder } from '../backend/api/backend.article';
import { SampleThirdItemBuilder } from './api/sample.third.item';

@Injectable()
export class SampleService {
  constructor(private readonly backendService: BackendService) {}

  async first(
    token: string,
    userId: string,
    id: string,
  ): Promise<SampleFirstResponse> {
    const journal = await this.backendService.fetchLarge(
      token,
      userId + '++' + id,
    );

    const firstItems = Array.from(this.defaultArray(journal.articles))
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 5)
      .map((article) =>
        new SampleFirstItemBuilder()
          .name(article.title)
          .tags(this.defaultArray(article.authors).sort())
          .length(this.getDifference(article.from_page, article.to_page))
          .created_at(article.last_updated_at)
          .build(),
      );

    const hash = crypto.createHash('md5');
    hash.update(journal.title);
    for (const editor of this.defaultArray(journal.editors)) {
      hash.update(editor);
    }

    return new SampleFirstResponseBuilder()
      .id(journal.id)
      .hash(hash.digest('base64'))
      .version(String(journal.issue))
      .url(journal.url)
      .total_number_of_items(
        this.defaultArray(journal.articles)
          .flatMap((article) => this.defaultArray(article.sections))
          .map((section) => section.words)
          .reduce((sum, words) => sum + words, 0),
      )
      .selected_items(firstItems)
      .build();
  }

  private getDifference(a: number, b: number): number {
    if (a == null && b == null) {
      return null;
    }
    return Math.abs(this.defaultNumber(a) - this.defaultNumber(b));
  }

  async second(
    token: string,
    userId: string,
    id: string,
  ): Promise<SampleSecondResponse> {
    const planet = await this.backendService.fetchMedium(
      token,
      userId + '++sec-' + id,
    );
    const name1 = this.getName(planet.moons, 0);
    const name2 = this.getName(planet.moons, 1);
    const name3 = this.getName(planet.moons, 2);

    const opera1 = await this.backendService.fetchSmall(token, 'foo_' + name1);
    const opera2 = await this.backendService.fetchSmall(token, 'bar_' + name2);
    const opera3 = await this.backendService.fetchSmall(token, 'quz_' + name3);

    return new SampleSecondResponseBuilder()
      .relevant(this.defaultArray(planet.missions).some((m) => m.includes('f')))
      .omit(!planet.gas)
      .description(
        this.defaultArray(planet.moons)
          .map((moon) => moon.name)
          .reduce(
            (acc, name) => (acc.length > 0 ? acc + '--' + name : name),
            '',
          ),
      )
      .weight(planet.diameter + planet.orbit)
      .items([
        new SampleSecondItemBuilder()
          .name(name1)
          .details(opera1.style)
          .timestamp(opera1.composed_at)
          .count(opera1.number_of_acts)
          .build(),
        new SampleSecondItemBuilder()
          .name(name2)
          .details(opera2.style)
          .timestamp(opera2.composed_at)
          .count(opera2.number_of_acts)
          .build(),
        new SampleSecondItemBuilder()
          .name(name3)
          .details(opera3.style)
          .timestamp(opera3.composed_at)
          .count(opera3.number_of_acts)
          .build(),
      ])
      .build();
  }

  private getName(moons: BackendMoon[], index: number): string {
    if (!Array.isArray(moons) || index >= moons.length) {
      return '(none)';
    }
    const moon = moons[index];
    if (moon.name == null) {
      return '(none)';
    }
    return moon.name;
  }

  async third(
    token: string,
    userId: string,
    id: string,
    request: SampleThirdRequest,
  ): Promise<SampleThirdResponse> {
    const result1 = await this.backendService.pushSmall(
      token,
      'a.10:' + id,
      new BackendOperaBuilder()
        .name('first ' + request.value)
        .composed_at(request.timestamp)
        .number_of_acts(10)
        .build(),
    );

    const result2 = await this.backendService.pushSmall(
      token,
      'a.20:' + id,
      new BackendOperaBuilder()
        .name('second ' + request.value)
        .composed_at(request.timestamp)
        .number_of_acts(10)
        .build(),
    );

    const journal = await this.backendService.pushLarge(
      token,
      userId + '++xg.3.f4:' + id,
      new BackendJournalBuilder()
        .name(request.value)
        .issue(request.count)
        .articles([
          new BackendArticleBuilder()
            .title(result1.name)
            .last_updated_at(result1.composed_at)
            .build(),
          new BackendArticleBuilder()
            .title(result2.name)
            .last_updated_at(result2.composed_at)
            .build(),
        ])
        .build(),
    );

    const lastUpdatedAt = this.defaultArray(journal.articles)
      .map((article) => article.last_updated_at)
      .filter((date) => date != null)
      .reduce(
        (last, current) =>
          last == null ? current : current > last ? current : last,
        null,
      );

    return new SampleThirdResponseBuilder()
      .name(journal.name)
      .description(
        journal.title +
          ' ' +
          this.defaultString(journal.publisher) +
          ' ' +
          this.defaultString(journal.url),
      )
      .created_at(journal.published_at)
      .last_updated_at(lastUpdatedAt == null ? new Date() : lastUpdatedAt)
      .labels(this.defaultArray(journal.editors).map((s) => '- ' + s))
      .total_count(
        this.defaultArray(journal.articles)
          .map((article) => this.defaultArray(article.sections).length)
          .reduce((sum, i) => sum + i, 0),
      )
      .items(
        this.defaultArray(journal.articles).map((article) =>
          new SampleThirdItemBuilder()
            .details(article.description)
            .steps(article.authors)
            .contents(
              this.defaultArray(article.sections).map(
                (section) => section.summary,
              ),
            )
            .timestamp(article.last_updated_at)
            .build(),
        ),
      )
      .build();
  }

  private defaultNumber(a: number): number {
    if (a == null) {
      return 0;
    }
    return a;
  }

  private defaultString(s: string): string {
    if (s == null) {
      return '';
    }
    return s;
  }

  private defaultArray<T>(items: T[]): T[] {
    if (!Array.isArray(items)) {
      return [];
    }
    return items;
  }
}
