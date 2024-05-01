import { SampleSecondItem } from './sample.second.item';

export class SampleSecondResponse {
  constructor(
    readonly relevant: boolean,
    readonly omit: boolean,
    readonly description: string,
    readonly weight: number,
    readonly items: SampleSecondItem[],
  ) {}
}

export class SampleSecondResponseBuilder {
  private relevant_value: boolean;
  private omit_value: boolean;
  private description_value: string;
  private weight_value: number;
  private items_value: SampleSecondItem[];

  constructor() {}

  relevant(value: boolean): SampleSecondResponseBuilder {
    this.relevant_value = value;
    return this;
  }

  omit(value: boolean): SampleSecondResponseBuilder {
    this.omit_value = value;
    return this;
  }

  description(value: string): SampleSecondResponseBuilder {
    this.description_value = value;
    return this;
  }

  weight(value: number): SampleSecondResponseBuilder {
    this.weight_value = value;
    return this;
  }

  items(value: SampleSecondItem[]): SampleSecondResponseBuilder {
    this.items_value = value;
    return this;
  }

  build(): SampleSecondResponse {
    return new SampleSecondResponse(
      this.relevant_value,
      this.omit_value,
      this.description_value,
      this.weight_value,
      this.items_value,
    );
  }
}
