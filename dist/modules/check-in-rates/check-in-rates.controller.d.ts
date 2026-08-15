import { CheckInRatesService } from './check-in-rates.service';
import { SetCheckInRateDto } from './dto/check-in-rate.dto';
export declare class CheckInRatesController {
    private readonly checkInRatesService;
    constructor(checkInRatesService: CheckInRatesService);
    setRate(req: any, dto: SetCheckInRateDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/check-in-rate.schema").CheckInRateDocument, {}, {}> & import("../../schemas/check-in-rate.schema").CheckInRate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getRateForDriver(driverId: string, weekStartDate?: string): Promise<{
        driverId: string;
        effectiveWeekStart: string;
        weeklyAmount: number;
        isLocked: boolean;
    }>;
}
