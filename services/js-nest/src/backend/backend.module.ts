import { Module } from '@nestjs/common';
import { BackendService } from './backend.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  exports: [BackendService],
  imports: [HttpModule],
  providers: [BackendService],
})
export class BackendModule {}
