import { SampleFirstItemBuilder } from "../../sample/api/sample.first.item";

export class BackendOpera {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly composer: string,
    readonly composed_at: Date,
    readonly published_at: Date,
    readonly description: string,
    readonly number_of_acts: number,
    readonly style: string,
    readonly open_air: boolean,
  ) {}
}

export class BackendOperaBuilder {
  private id_value: string;
  private name_value: string;
  private composer_value: string;
  private composed_at_value: Date;
  private published_at_value: Date;
  private description_value: string;
  private number_of_acts_value: number;
  private style_value: string;
  private open_air_value: boolean;

  constructor() {}

  id(value: string): BackendOperaBuilder {
    this.id_value = value;
    return this;
  }

  name(value: string): BackendOperaBuilder {
    this.name_value = value;
    return this;
  }

  composer(value: string): BackendOperaBuilder {
    this.composer_value = value;
    return this;
  }

  composed_at(value: Date): BackendOperaBuilder {
    this.composed_at_value = value;
    return this;
  }

  published_at(value: Date): BackendOperaBuilder {
    this.published_at_value = value;
    return this;
  }

  description(value: string): BackendOperaBuilder {
    this.description_value = value;
    return this;
  }

  number_of_acts(value: number): BackendOperaBuilder {
    this.number_of_acts_value = value;
    return this;
  }

  style(value: string): BackendOperaBuilder {
    this.style_value = value;
    return this;
  }

  open_air(value: boolean): BackendOperaBuilder {
    this.open_air_value = value;
    return this;
  }

  build(): BackendOpera {
    return new BackendOpera(
      this.id_value,
      this.name_value,
      this.composer_value,
      this.composed_at_value,
      this.published_at_value,
      this.description_value,
      this.number_of_acts_value,
      this.style_value,
      this.open_air_value,
    );
  }
}
