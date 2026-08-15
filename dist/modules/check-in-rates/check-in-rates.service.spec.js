"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const check_in_rates_service_1 = require("./check-in-rates.service");
const check_in_rate_schema_1 = require("../../schemas/check-in-rate.schema");
const user_schema_1 = require("../../schemas/user.schema");
describe('CheckInRatesService', () => {
    let service;
    const mockCheckInRateModel = {
        findOneAndUpdate: jest.fn(),
        findOne: jest.fn(),
    };
    const mockUserModel = {
        findById: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                check_in_rates_service_1.CheckInRatesService,
                {
                    provide: (0, mongoose_1.getModelToken)(check_in_rate_schema_1.CheckInRate.name),
                    useValue: mockCheckInRateModel,
                },
                {
                    provide: (0, mongoose_1.getModelToken)(user_schema_1.User.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();
        service = module.get(check_in_rates_service_1.CheckInRatesService);
    });
    it('should throw BadRequestException if owner attempts to change check-in for a week that has already started', async () => {
        mockUserModel.findById.mockResolvedValue({ _id: 'driver123', role: user_schema_1.UserRole.DRIVER });
        const pastMonday = '2026-08-03';
        await expect(service.setRate('owner123', {
            driverId: 'driver123',
            weeklyAmount: 2500,
            effectiveWeekStart: pastMonday,
        })).rejects.toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=check-in-rates.service.spec.js.map