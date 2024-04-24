export class HealthStatus {
  constructor(status = 'UP') {
    this.status = status;
  }
  status: string;
}
