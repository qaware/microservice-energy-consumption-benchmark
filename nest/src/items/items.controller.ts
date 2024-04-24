import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from '../auth/auth.guard';
import { ItemsOverviewList } from './api/items.overview.list';
import { ItemsDetail } from './api/items.detail';

@Controller('api/sample/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getOverview(
    @Query('from') fromId: string,
    @Query('limit') limit: string,
    @Request() request,
  ): Promise<ItemsOverviewList> {
    return await this.itemsService.getOverview(
      request.userId,
      fromId,
      parseInt(limit || '10'),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getDetails(
    @Param('id') id: string,
    @Request() request,
  ): Promise<ItemsDetail> {
    return this.itemsService.getDetails(request.token, request.userId, id);
  }
}
