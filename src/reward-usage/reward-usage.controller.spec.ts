import { Test, TestingModule } from '@nestjs/testing';
import { RewardUsagesController } from './reward-usage.controller';
import { RewardUsagesService } from './reward-usage.service';

describe('RewardUsagesController', () => {
  let controller: RewardUsagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardUsagesController],
      providers: [RewardUsagesService],
    }).compile();

    controller = module.get<RewardUsagesController>(RewardUsagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
