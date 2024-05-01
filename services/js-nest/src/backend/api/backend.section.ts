export class BackendSection {
  constructor(
    readonly title: string,
    readonly summary: string,
    readonly words: number,
    readonly last_updated_at: Date,
  ) {}
}

export class BackendSectionBuilder {
  private title_value: string;
  private summary_value: string;
  private words_value: number;
  private last_updated_at_value: Date;

  constructor() {}

  title(value: string): BackendSectionBuilder {
    this.title_value = value;
    return this;
  }

  summary(value: string): BackendSectionBuilder {
    this.summary_value = value;
    return this;
  }

  words(value: number): BackendSectionBuilder {
    this.words_value = value;
    return this;
  }

  last_updated_at(value: Date): BackendSectionBuilder {
    this.last_updated_at_value = value;
    return this;
  }

  build(): BackendSection {
    return new BackendSection(
      this.title_value,
      this.summary_value,
      this.words_value,
      this.last_updated_at_value,
    );
  }
}
