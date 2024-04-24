export class ItemsOverview {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly status: string,
    readonly color: string,
    readonly iteration: number,
    readonly updated_at: Date,
  ) {}
}
