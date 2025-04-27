import { Test, TestingModule } from '@nestjs/testing';
import { RewardUsageService } from './reward-usage.service';

describe('RewardUsageService', () => {
  let service: RewardUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardUsageService],
    }).compile();

    service = module.get<RewardUsageService>(RewardUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
