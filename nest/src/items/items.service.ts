import { Injectable } from '@nestjs/common';
import { ItemsDetail } from './api/items.detail';
import { ItemsOverviewList } from './api/items.overview.list';
import { Knex } from 'knex';
import { ItemsOverview } from './api/items.overview';
import { ItemsPreview } from './api/items.preview';
import { InjectConnection } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { ItemsStep } from './api/items.step';

@Injectable()
export class ItemsService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly httpService: HttpService,
  ) {}

  async getOverview(
    userId: string,
    fromId: string,
    limit: number,
  ): Promise<ItemsOverviewList> {
    const storedItems = await this.getStoredItems(userId, fromId, limit);

    const overviewItems = storedItems.map(
      (item: StoredItem) =>
        new ItemsOverview(
          item.id,
          item.title,
          item.description,
          item.status,
          item.color,
          item.iteration,
          item.updated_at,
        ),
    );

    return new ItemsOverviewList(
      overviewItems.slice(0, Math.min(limit, overviewItems.length)),
      overviewItems.length > limit ? overviewItems[limit].id : null,
    );
  }

  private async getStoredItems(
    userId: string,
    fromId: string,
    limit: number,
  ): Promise<StoredItem[]> {
    if (!fromId) {
      return this.knex('items')
        .withSchema('nest')
        .select()
        .where('user_id', userId)
        .orderBy('id')
        .limit(limit + 1);
    } else {
      return this.knex('items')
        .withSchema('nest')
        .where('user_id', userId)
        .andWhere('id', '>=', fromId)
        .orderBy('id')
        .limit(limit + 1);
    }
  }

  async getDetails(
    token: string,
    userId: string,
    itemId: string,
  ): Promise<ItemsDetail> {
    const storedItem = await this.getStoredItem(userId, itemId);
    const storedPreviews = await this.getPreviews(itemId);
    const externalStepList = await this.getSteps(token, itemId);

    return new ItemsDetail(
      storedItem.id,
      storedItem.title,
      storedItem.description,
      storedItem.status,
      storedItem.color,
      storedItem.iteration,
      storedPreviews.map(
        (item) => new ItemsPreview(item.id, item.data, item.createdAt),
      ),
      externalStepList.steps.map(
        (step: ExternalStep) =>
          new ItemsStep(step.name, step.labels, step.duration_in_ms),
      ),
      storedItem.updated_at,
    );
  }

  private async getStoredItem(
    userId: string,
    itemId: string,
  ): Promise<StoredItem> {
    const items = await this.knex('items')
      .withSchema('nest')
      .where('user_id', userId)
      .andWhere('id', itemId);
    // TODO: raise an exception if 'items' does not contain exactly one item
    return items[0];
  }

  private async getPreviews(itemId: string): Promise<StoredPreview[]> {
    return this.knex('previews').withSchema('nest').where('item_id', itemId);
  }

  private async getSteps(
    token: string,
    itemId: string,
  ): Promise<ExternalStepList> {
    const { data } = await firstValueFrom(
      this.httpService.get<ExternalStepList>(
        process.env.STEPS_URL + '/api/items/' + itemId + '/steps',
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }
}

class StoredItem {
  id: string;
  title: string;
  description: string;
  status: string;
  color: string;
  iteration: number;
  updated_at: Date;
}

class StoredPreview {
  id: string;
  data: string;
  createdAt: Date;
}

class ExternalStepList {
  steps: ExternalStep[];
}

class ExternalStep {
  id: string;
  name: string;
  labels: string[];
  duration_in_ms: number;
}
