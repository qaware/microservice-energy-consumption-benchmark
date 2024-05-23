import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SampleService } from './sample.service';
import { AuthGuard } from '../auth/auth.guard';
import { SampleFirstResponse } from './api/sample.first.response';
import { SampleSecondResponse } from './api/sample.second.response';
import { SampleThirdResponse } from './api/sample.third.response';
import { SampleThirdRequest } from './api/sample.third.request';

@Controller('api/sample/:id')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get('first')
  @UseGuards(AuthGuard)
  async first(
    @Param('id') id: string,
    @Request() request,
  ): Promise<SampleFirstResponse> {
    return await this.sampleService.first(request.token, request.userId, id);
  }

  @Get('second')
  @UseGuards(AuthGuard)
  async second(
    @Param('id') id: string,
    @Request() request,
  ): Promise<SampleSecondResponse> {
    return this.sampleService.second(request.token, request.userId, id);
  }

  @Post('third')
  @UseGuards(AuthGuard)
  async third(
    @Param('id') id: string,
    @Body() body: SampleThirdRequest,
    @Request() request,
  ): Promise<SampleThirdResponse> {
    return this.sampleService.third(request.token, request.userId, id, body);
  }
}
