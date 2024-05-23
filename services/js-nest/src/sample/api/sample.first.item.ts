export class SampleFirstItem {
  constructor(
    readonly name: string,
    readonly tags: string[],
    readonly length: number,
    readonly created_at: Date,
  ) {}
}

export class SampleFirstItemBuilder {
  private name_value: string;
  private tags_value: string[];
  private length_value: number;
  private created_at_value: Date;

  constructor() {}

  name(value: string): SampleFirstItemBuilder {
    this.name_value = value;
    return this;
  }

  tags(value: string[]): SampleFirstItemBuilder {
    this.tags_value = value;
    return this;
  }

  length(value: number): SampleFirstItemBuilder {
    this.length_value = value;
    return this;
  }

  created_at(value: Date): SampleFirstItemBuilder {
    this.created_at_value = value;
    return this;
  }

  build(): SampleFirstItem {
    return new SampleFirstItem(
      this.name_value,
      this.tags_value,
      this.length_value,
      this.created_at_value,
    );
  }
}
