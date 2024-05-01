export class SampleThirdItem {
  constructor(
    readonly details: string,
    readonly steps: string[],
    readonly contents: string[],
    readonly timestamp: Date,
  ) {}
}

export class SampleThirdItemBuilder {
  private details_value: string;
  private steps_value: string[];
  private contents_value: string[];
  private timestamp_value: Date;

  constructor() {}

  details(value: string): SampleThirdItemBuilder {
    this.details_value = value;
    return this;
  }

  steps(value: string[]): SampleThirdItemBuilder {
    this.steps_value = value;
    return this;
  }

  contents(value: string[]): SampleThirdItemBuilder {
    this.contents_value = value;
    return this;
  }

  timestamp(value: Date): SampleThirdItemBuilder {
    this.timestamp_value = value;
    return this;
  }

  build(): SampleThirdItem {
    return new SampleThirdItem(
      this.details_value,
      this.steps_value,
      this.contents_value,
      this.timestamp_value,
    );
  }
}
