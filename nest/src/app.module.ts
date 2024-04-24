import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { HealthModule } from './health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { KnexModule } from 'nest-knexjs';
import * as process from 'node:process';

// TODO: add further metrics, possibly via https://github.com/pragmaticivan/nestjs-otel
@Module({
  imports: [
    PrometheusModule.register(),
    HealthModule,
    ItemsModule,
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: process.env.DB_CONNECTION,
      },
    }),
  ],
})
export class AppModule {}
