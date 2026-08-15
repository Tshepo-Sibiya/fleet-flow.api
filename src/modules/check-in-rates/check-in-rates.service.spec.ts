import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { CheckInRatesService } from './check-in-rates.service';
import { CheckInRate } from '../../schemas/check-in-rate.schema';
import { User, UserRole } from '../../schemas/user.schema';

describe('CheckInRatesService', () => {
  let service: CheckInRatesService;

  const mockCheckInRateModel = {
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInRatesService,
        {
          provide: getModelToken(CheckInRate.name),
          useValue: mockCheckInRateModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<CheckInRatesService>(CheckInRatesService);
  });

  it('should throw BadRequestException if owner attempts to change check-in for a week that has already started', async () => {
    mockUserModel.findById.mockResolvedValue({ _id: 'driver123', role: UserRole.DRIVER });

    // Past Monday date
    const pastMonday = '2026-08-03';

    await expect(
      service.setRate('owner123', {
        driverId: 'driver123',
        weeklyAmount: 2500,
        effectiveWeekStart: pastMonday,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
