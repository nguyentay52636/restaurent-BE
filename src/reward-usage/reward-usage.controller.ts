import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateRewardUsageDto } from './dto/create-reward-usage.dto';
import { UpdateRewardUsageDto } from './dto/update-reward-usage.dto';
import { RewardUsagesService } from 'src/reward-usage/reward-usage.service';

@Controller('reward-usages')
export class RewardUsagesController {
  constructor(private readonly rewardUsagesService: RewardUsagesService) {}

  @Post()
  create(@Body() dto: CreateRewardUsageDto) {
    return this.rewardUsagesService.create(dto);
  }

  @Get()
  findAll() {
    return this.rewardUsagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rewardUsagesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRewardUsageDto,
  ) {
    return this.rewardUsagesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rewardUsagesService.remove(id);
  }
}
