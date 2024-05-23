import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { JwtService } from '@nestjs/jwt';
import { BackendModule } from '../backend/backend.module';

@Module({
  imports: [BackendModule],
  controllers: [SampleController],
  providers: [SampleService, JwtService],
})
export class SampleModule {}
