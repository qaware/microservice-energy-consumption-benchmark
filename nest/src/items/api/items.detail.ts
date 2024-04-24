import { ItemsPreview } from './items.preview';
import { ItemsStep } from './items.step';

export class ItemsDetail {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private readonly status: string,
    private readonly color: string,
    private readonly iteration: number,
    private readonly previews: ItemsPreview[],
    private readonly steps: ItemsStep[],
    private readonly updated_at: Date,
  ) {}
}
