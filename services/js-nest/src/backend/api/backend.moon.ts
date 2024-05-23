export class BackendMoon {
  constructor(
    readonly name: string,
    readonly diameter: number,
    readonly distance: number,
    readonly discovered_at: Date,
    readonly discovered_by: string,
    readonly possible_life: boolean,
  ) {}
}

export class BackendMoonBuilder {
  private name_value: string;
  private diameter_value: number;
  private distance_value: number;
  private discovered_at_value: Date;
  private discovered_by_value: string;
  private possible_life_value: boolean;

  constructor() {}

  name(value: string): BackendMoonBuilder {
    this.name_value = value;
    return this;
  }

  diameter(value: number): BackendMoonBuilder {
    this.diameter_value = value;
    return this;
  }

  distance(value: number): BackendMoonBuilder {
    this.distance_value = value;
    return this;
  }

  discovered_at(value: Date): BackendMoonBuilder {
    this.discovered_at_value = value;
    return this;
  }

  discovered_by(value: string): BackendMoonBuilder {
    this.discovered_by_value = value;
    return this;
  }

  possible_life(value: boolean): BackendMoonBuilder {
    this.possible_life_value = value;
    return this;
  }

  build(): BackendMoon {
    return new BackendMoon(
      this.name_value,
      this.diameter_value,
      this.distance_value,
      this.discovered_at_value,
      this.discovered_by_value,
      this.possible_life_value,
    );
  }
}
