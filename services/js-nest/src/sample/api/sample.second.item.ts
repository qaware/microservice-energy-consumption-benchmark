export class SampleSecondItem {
  constructor(
    readonly name: string,
    readonly details: string,
    readonly timestamp: Date,
    readonly count: number,
  ) {}
}

export class SampleSecondItemBuilder {
  private name_value: string;
  private details_value: string;
  private timestamp_value: Date;
  private count_value: number;

  constructor() {}

  name(value: string): SampleSecondItemBuilder {
    this.name_value = value;
    return this;
  }

  details(value: string): SampleSecondItemBuilder {
    this.details_value = value;
    return this;
  }

  timestamp(value: Date): SampleSecondItemBuilder {
    this.timestamp_value = value;
    return this;
  }

  count(value: number): SampleSecondItemBuilder {
    this.count_value = value;
    return this;
  }

  build(): SampleSecondItem {
    return new SampleSecondItem(
      this.name_value,
      this.details_value,
      this.timestamp_value,
      this.count_value,
    );
  }
}