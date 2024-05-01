import { SampleThirdItem } from './sample.third.item';

export class SampleThirdResponse {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly created_at: Date,
    readonly last_updated_at: Date,
    readonly labels: string[],
    readonly total_count: number,
    readonly items: SampleThirdItem[],
  ) {}
}

export class SampleThirdResponseBuilder {
  private name_value: string;
  private description_value: string;
  private created_at_value: Date;
  private last_updated_at_value: Date;
  private labels_value: string[];
  private total_count_value: number = 0;
  private items_value: SampleThirdItem[];

  constructor() {}

  name(value: string): SampleThirdResponseBuilder {
    this.name_value = value;
    return this;
  }

  description(value: string): SampleThirdResponseBuilder {
    this.description_value = value;
    return this;
  }

  created_at(value: Date): SampleThirdResponseBuilder {
    this.created_at_value = value;
    return this;
  }

  last_updated_at(value: Date): SampleThirdResponseBuilder {
    this.last_updated_at_value = value;
    return this;
  }

  labels(value: string[]): SampleThirdResponseBuilder {
    this.labels_value = value;
    return this;
  }

  total_count(value: number): SampleThirdResponseBuilder {
    this.total_count_value = value;
    return this;
  }

  items(value: SampleThirdItem[]): SampleThirdResponseBuilder {
    this.items_value = value;
    return this;
  }

  build(): SampleThirdResponse {
    return new SampleThirdResponse(
      this.name_value,
      this.description_value,
      this.created_at_value,
      this.last_updated_at_value,
      this.labels_value,
      this.total_count_value,
      this.items_value,
    );
  }
}
