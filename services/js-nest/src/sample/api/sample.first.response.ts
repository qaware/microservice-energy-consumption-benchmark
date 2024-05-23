import { SampleFirstItem } from './sample.first.item';

export class SampleFirstResponse {
  constructor(
    readonly id: string,
    readonly hash: string,
    readonly version: string,
    readonly url: string,
    readonly total_number_of_items: number,
    readonly selected_items: SampleFirstItem[],
  ) {}
}

export class SampleFirstResponseBuilder {
  private id_value: string;
  private hash_value: string;
  private version_value: string;
  private url_value: string;
  private total_number_of_items_value: number;
  private selected_items_value: SampleFirstItem[];

  constructor() {}

  id(value: string): SampleFirstResponseBuilder {
    this.id_value = value;
    return this;
  }

  hash(value: string): SampleFirstResponseBuilder {
    this.hash_value = value;
    return this;
  }

  version(value: string): SampleFirstResponseBuilder {
    this.version_value = value;
    return this;
  }

  url(value: string): SampleFirstResponseBuilder {
    this.url_value = value;
    return this;
  }

  total_number_of_items(value: number): SampleFirstResponseBuilder {
    this.total_number_of_items_value = value;
    return this;
  }

  selected_items(value: SampleFirstItem[]): SampleFirstResponseBuilder {
    this.selected_items_value = value;
    return this;
  }

  build(): SampleFirstResponse {
    return new SampleFirstResponse(
      this.id_value,
      this.hash_value,
      this.version_value,
      this.url_value,
      this.total_number_of_items_value,
      this.selected_items_value,
    );
  }
}
