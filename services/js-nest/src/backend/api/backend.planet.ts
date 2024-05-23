import { BackendMoon } from './backend.moon';

export class BackendPlanet {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly diameter: number,
    readonly orbit: number,
    readonly gas: boolean,
    readonly discovered_at: Date,
    readonly discovered_by: string,
    readonly history: string,
    readonly missions: string[],
    readonly moons: BackendMoon[],
  ) {}
}

export class BackendPlanetBuilder {
  private id_value: string;
  private name_value: string;
  private diameter_value: number;
  private orbit_value: number;
  private gas_value: boolean;
  private discovered_at_value: Date;
  private discovered_by_value: string;
  private history_value: string;
  private missions_value: string[];
  private moons_value: BackendMoon[];

  constructor() {}

  id(value: string): BackendPlanetBuilder {
    this.id_value = value;
    return this;
  }

  name(value: string): BackendPlanetBuilder {
    this.name_value = value;
    return this;
  }

  diameter(value: number): BackendPlanetBuilder {
    this.diameter_value = value;
    return this;
  }

  orbit(value: number): BackendPlanetBuilder {
    this.orbit_value = value;
    return this;
  }

  gas(value: boolean): BackendPlanetBuilder {
    this.gas_value = value;
    return this;
  }

  discovered_at(value: Date): BackendPlanetBuilder {
    this.discovered_at_value = value;
    return this;
  }

  discovered_by(value: string): BackendPlanetBuilder {
    this.discovered_by_value = value;
    return this;
  }

  history(value: string): BackendPlanetBuilder {
    this.history_value = value;
    return this;
  }

  missions(value: string[]): BackendPlanetBuilder {
    this.missions_value = value;
    return this;
  }

  moons(value: BackendMoon[]): BackendPlanetBuilder {
    this.moons_value = value;
    return this;
  }

  build(): BackendPlanet {
    return new BackendPlanet(
      this.id_value,
      this.name_value,
      this.diameter_value,
      this.orbit_value,
      this.gas_value,
      this.discovered_at_value,
      this.discovered_by_value,
      this.history_value,
      this.missions_value,
      this.moons_value,
    );
  }
}
