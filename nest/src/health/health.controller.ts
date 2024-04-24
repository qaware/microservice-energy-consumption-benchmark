import { Controller, Get } from '@nestjs/common';
import { HealthStatus } from './health.status';

@Controller('health')
export class HealthController {
  @Get('live')
  getLive(): HealthStatus {
    return new HealthStatus();
  }
  @Get('ready')
  getReady(): HealthStatus {
    return new HealthStatus();
  }
  @Get('started')
  getStarted(): HealthStatus {
    return new HealthStatus();
  }
}
