import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController],
  providers: [ItemsService, JwtService],
})
export class ItemsModule {}
