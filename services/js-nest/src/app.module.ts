import { Module } from '@nestjs/common';
import { SampleModule } from './sample/sample.module';
import { HealthModule } from './health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

// TODO: add further metrics, possibly via https://github.com/pragmaticivan/nestjs-otel
@Module({
  imports: [PrometheusModule.register(), HealthModule, SampleModule],
})
export class AppModule {}
