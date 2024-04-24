import { ItemsOverview } from './items.overview';

export class ItemsOverviewList {
  constructor(
    private readonly items: ItemsOverview[],
    private readonly next: string,
  ) {}
}
